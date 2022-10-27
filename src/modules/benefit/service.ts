import {
  Address,
  Associated,
  BankAccount,
  Benefit,
  BenefitAdjustmentType,
  BenefitStatus,
  EmploymentRelationship,
  Installment,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { addMonths, differenceInMonths, endOfMonth } from 'date-fns';
import { IPrismaTransactionClient } from 'src/interfaces/infra/IPrismaTranscationClient';

import ErrorCodes from '../../enums/ErrorCodes';
import { MonthOfPayment } from '../../enums/MonthOfPayment';
import { MissingInvalidParamsError, NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { IAssociatedRepository } from '../associated/interfaces';
import { IInstallmentRepository } from '../installment/interfaces';
import { loanConfig } from '../loanSimulation/consts';
import {
  ILoanSimulationBasedOnRequestedValueParams,
  ILoanSimulationService,
} from '../loanSimulation/interfaces';
import {
  IBenefitRepository,
  IBenefitService,
  ICreateBenefitParams,
} from './interfaces';

export class BenefitService implements IBenefitService {
  constructor(
    private readonly benefitRepository: IBenefitRepository,
    private readonly associatedRepository: IAssociatedRepository,
    private readonly loanSimulationService: ILoanSimulationService,
    private readonly installmentRepository: IInstallmentRepository,
    private readonly prisma: PrismaClient,
  ) { }

  public async getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>> {
    const result = await this.benefitRepository.findAll(payload);

    return result;
  }

  public async getById(id: number): Promise<Benefit | null> {
    const result = await this.benefitRepository.findById(id);
    if (!result) {
      throw new NotFoundError('benefit not found with provided id');
    }

    return result;
  }

  private formatMonthOfPayment(
    disposiblePaymentDates: Date[],
    monthOfPayment: MonthOfPayment,
  ): Date {
    if (monthOfPayment === MonthOfPayment.CURRENT_MONTH) {
      return disposiblePaymentDates[0];
    }

    if (monthOfPayment === MonthOfPayment.NEXT_MONTH) {
      return disposiblePaymentDates[1];
    }

    return disposiblePaymentDates[2];
  }

  private validateBenefitPeriodWhenEmploymentRelationshipIsTemporary(
    lastInstallmentReferenceDate?: Date,
    employmentRelationshipFinalDate?: Date | null,
  ): void {
    if (!lastInstallmentReferenceDate || !employmentRelationshipFinalDate) {
      return;
    }
    const installmentDifferenceInMonths = differenceInMonths(
      lastInstallmentReferenceDate,
      endOfMonth(employmentRelationshipFinalDate),
    );

    if (installmentDifferenceInMonths < 2) {
      throw new MissingInvalidParamsError(
        'the benefit must finish at least two months before the end of the temporary contract',
        ErrorCodes.CREATE_BENEFIT_ERROR_001,
      );
    }
  }

  public async create(payload: ICreateBenefitParams): Promise<Benefit> {
    const {
      type,
      associatedId,
      consultantId,
      addressId,
      bankAccountId,
      employmentRelationshipId,
      hasGratification,
      joinedTelemedicine,
      monthOfPayment,
      numberOfInstallments,
      requestedValue,
      salary,
      administrationFeeValue,
      affiliationId,
      createdBy,
    } = payload;

    const {
      bankAccounts,
      addresses,
      employmentRelationships,
      affiliations,
      ...associated
    } = (await this.associatedRepository.findById(associatedId)) || {};

    this.validateAssociated(associated);

    const address = (addresses || []).find(
      (addressItem: Address) => addressItem.id === addressId,
    ) as Address;
    const bankAccount = (bankAccounts || []).find(
      (bankAccountItem: BankAccount) => bankAccountItem.id === bankAccountId,
    ) as BankAccount;
    const employmentRelationship = (employmentRelationships || []).find(
      (employmentRelationshipItem: EmploymentRelationship) =>
        employmentRelationshipItem.id === employmentRelationshipId,
    ) as EmploymentRelationship;

    this.validateAssociatedData(address, bankAccount, employmentRelationship);

    const {
      consultantCommission,
      totalValue,
      installments,
      firstPaymentDates,
    } = await this.getLoanSimulation({
      hasGratification,
      joinedTelemedicine,
      monthOfPayment,
      numberOfInstallments,
      requestedValue,
      salary,
      employmentRelationship,
      administrationFeeValue,
      consultantId,
    });

    if (employmentRelationship.contractType === 'TEMPORARY') {
      const lastInstallment = [...installments].pop();
      this.validateBenefitPeriodWhenEmploymentRelationshipIsTemporary(
        lastInstallment?.referenceDate,
        employmentRelationship.finalDate,
      );
    }

    const {
      birthDate,
      cellPhone,
      createdAt,
      deletedAt,
      email,
      emissionDate,
      emissionState,
      father,
      gender,
      issuingAgency,
      lastName,
      maritalStatus,
      mother,
      name,
      nationality,
      partner,
      placeOfBirth,
      registerId,
      taxId,
      updatedAt,
      updatedBy,
    } = associated as Associated;

    return this.prisma.$transaction(
      async (prisma: IPrismaTransactionClient) => {
        const result = await this.benefitRepository.create(
          {
            affiliation: {
              connect: {
                id: affiliationId,
              },
            },
            accountNumber: bankAccount.accountNumber,
            accountType: bankAccount.accountType,
            bank: bankAccount.bank,
            pixKey: bankAccount.pixKey,
            pixType: bankAccount.pixType,
            agency: bankAccount.agency,
            addressType: address.addressType,
            street: address.street,
            houseNumber: address.houseNumber,
            district: address.district,
            city: address.city,
            state: address.state,
            complement: address.complement,
            postalCode: address.postalCode,
            administrationFeeValue,
            hasGratification,
            joinedTelemedicine,
            salary: employmentRelationship.salary,
            registerNumber: employmentRelationship.registerNumber,
            initialDate: this.formatMonthOfPayment(
              firstPaymentDates,
              monthOfPayment,
            ),
            contractType: type,
            contractModel: '',
            birthDate,
            cellPhone,
            createdAt,
            createdBy,
            deletedAt,
            email,
            emissionDate,
            emissionState,
            father,
            gender,
            issuingAgency,
            lastName,
            maritalStatus,
            mother,
            name,
            nationality,
            partner,
            placeOfBirth,
            registerId,
            taxId,
            updatedAt,
            updatedBy,
            commission: consultantCommission,
            financialAssistanceValue: totalValue,
            installmentNumber: numberOfInstallments,

            publicAgency: employmentRelationship.publicAgency,

            installmentValue: installments[0].finalValue,
            occupation: employmentRelationship.occupation,
            paymentDay: employmentRelationship.paymentDay,

            status: BenefitStatus.UNDER_ANALYSIS,
            associated: {
              connect: {
                id: associatedId,
              },
            },
            ...(consultantId
              ? {
                consultant: {
                  connect: {
                    id: consultantId,
                  },
                },
              }
              : {}),
          },
          prisma,
        );
        await this.installmentRepository.createMany(
          [...installments].map(installment => ({
            ...installment,
            benefitId: result.id,
            createdBy,
          })),
          prisma,
        );

        return result;
      },
    );
  }

  private async getLoanSimulation(
    payload: Omit<
      ILoanSimulationBasedOnRequestedValueParams,
      'salaryReceiptDate'
    > & {
      employmentRelationship: EmploymentRelationship;
    },
  ): Promise<{
    consultantCommission: any;
    isRequestedValueValid: any;
    totalValue: any;
    installments: any;
    firstPaymentDates: any;
  }> {
    const result =
      await this.loanSimulationService.simulateLoanBasedOnRequestedValue({
        ...payload,
        salaryReceiptDate: new Date(
          new Date().setDate(payload.employmentRelationship.paymentDay),
        ),
      });

    if (!result.isRequestedValueValid) {
      throw new MissingInvalidParamsError(
        'the conditions of the benefit does not match with the rules, plase check the parameters',
      );
    }

    return result;
  }

  private validateAssociatedData(
    address: Address,
    bankAccount: BankAccount,
    employmentRelationship: EmploymentRelationship,
  ) {
    if (![address, bankAccount, employmentRelationship].every(item => !!item)) {
      throw new MissingInvalidParamsError(
        'the provided data is invalid, please check if the associated was created correctly',
      );
    }
  }

  private validateAssociated(
    associated:
      | {
        id: number;
        name: string;
        lastName: string;
        gender: string;
        birthDate: Date;
        maritalStatus: string;
        nationality: string;
        placeOfBirth: string;
        taxId: string;
        registerId: string;
        emissionState: string;
        issuingAgency: string;
        emissionDate: Date;
        cellPhone: string;
        email: string;
        father: string;
        mother: string;
        partner: string | null;
        createdBy: string;
        updatedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
      }
      | { [key: string]: any },
  ) {
    if (!associated) {
      throw new NotFoundError('Associated not found with the provided id');
    }
  }

  public async getPostponementSimulation(
    benefitId: number,
    single: boolean,
  ): Promise<Installment[]> {
    const benefitExists = await this.benefitRepository.findById(benefitId);

    if (!benefitExists) {
      throw new NotFoundError('does not exists a benefit with the provided id');
    }

    const installments = await this.installmentRepository.findAll({
      benefitId,
      justPendingInstallments: true,
    });

    if (single) {
      const [firstInstallment, ...restOfTheInstallments] = installments;
      return [
        {
          ...firstInstallment,
          finalValue:
            firstInstallment.finalValue * (1 + loanConfig.adjustmentFee / 100),
          referenceDate: addMonths(firstInstallment.referenceDate, 1),
          reference: this.loanSimulationService.formatReferenceDate(
            addMonths(firstInstallment.referenceDate, 1),
          ),
        },
        ...restOfTheInstallments,
      ];
    }

    return installments.map(installment => ({
      ...installment,
      finalValue: installment.finalValue * (1 + loanConfig.adjustmentFee / 100),
      referenceDate: addMonths(installment.referenceDate, 1),
      reference: this.loanSimulationService.formatReferenceDate(
        addMonths(installment.referenceDate, 1),
      ),
    }));
  }

  public async postponementInstallment(payload: {
    id: number;
    user: string;
  }): Promise<void> {
    const times = await this.benefitRepository.countEditTimes(payload.id);

    if (times >= 3) {
      throw new MissingInvalidParamsError(
        'cannot update installment more than 3 times',
        ErrorCodes.POSTPONEMENT_INSTALLMENTS_ERROR_001,
      );
    }

    if (times === 2) {
      const installments = await this.installmentRepository.findAll({
        benefitId: payload.id,
        justPendingInstallments: true,
      });

      return this.singlePostponementInstallment({
        id: payload.id,
        user: payload.user,
        reference: installments[0].referenceDate,
      });
    }

    const installments = await this.installmentRepository.findAll({
      benefitId: payload.id,
      justPendingInstallments: true,
    });

    await Promise.all(
      installments.map(({ id, benefitId, ...installment }) =>
        this.installmentRepository.softUpdate(id, {
          ...installment,
          Benefit: {
            connect: {
              id: payload.id,
            },
          },
          finalValue:
            installment.finalValue * (1 + loanConfig.adjustmentFee / 100),
          reference: this.loanSimulationService.formatReferenceDate(
            addMonths(installment.referenceDate, 1),
          ),
          referenceDate: addMonths(installment.referenceDate, 1),
          dueDate: addMonths(installment.dueDate, 1),
          user: payload.user,
        }),
      ),
    );
    await this.benefitRepository.addItemToBenefitHistory({
      createdBy: payload.user,
      adjustment: {},
      adjustmentType: BenefitAdjustmentType.POSTPONEMENT,
      benefitId: payload.id,
    });
  }

  public async singlePostponementInstallment(payload: {
    id: number;
    reference: Date;
    user: string;
  }): Promise<void> {
    const installment =
      await this.installmentRepository.findByBenefitIdAndReference(
        payload.id,
        this.loanSimulationService.formatReferenceDate(payload.reference),
      );
    const nextInstallment =
      await this.installmentRepository.findByBenefitIdAndReference(
        payload.id,
        this.loanSimulationService.formatReferenceDate(
          addMonths(payload.reference, 1),
        ),
      );

    if (!installment || !nextInstallment) {
      throw new NotFoundError(
        'installment not found with the provided id and reference date',
      );
    }

    const recalculatedFinalValue = this.recalculateFinalValue(
      installment,
      nextInstallment,
    );

    const {
      id: installmentId,
      benefitId,
      ...installmentFormated
    } = installment;

    await this.installmentRepository.softUpdate(installmentId, {
      ...installmentFormated,
      Benefit: {
        connect: {
          id: payload.id,
        },
      },
      finalValue: recalculatedFinalValue,
      dueDate: addMonths(installmentFormated.dueDate, 1),
      referenceDate: addMonths(installmentFormated.referenceDate, 1),
      reference: this.loanSimulationService.formatReferenceDate(
        addMonths(installmentFormated.referenceDate, 1),
      ),
      user: payload.user,
    });

    const { id: nextInstallmentId } = nextInstallment;
    await this.installmentRepository.disable(nextInstallmentId, payload.user);
    await this.benefitRepository.addItemToBenefitHistory({
      createdBy: payload.user,
      adjustment: {},
      adjustmentType: BenefitAdjustmentType.SINGLE_POSTPONEMENT,
      benefitId: payload.id,
    });
  }

  private recalculateFinalValue(
    installment: Installment,
    nextInstallment: Installment,
  ) {
    const sumOfInstallmentValue =
      installment.finalValue + nextInstallment.finalValue;
    const result = sumOfInstallmentValue * (1 + loanConfig.adjustmentFee / 100);

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Benefit, 'id'>>,
  ): Promise<void> {
    const benefitExists = await this.benefitRepository.findById(id);
    if (!benefitExists) {
      throw new NotFoundError('benefit not found with provided id');
    }
    const result = await this.benefitRepository.updateById(id, payload);

    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const benefitExists = await this.benefitRepository.findById(id);
    if (!benefitExists) {
      throw new NotFoundError('benefit not found with provided id');
    }
    const result = await this.benefitRepository.deleteById(id);

    return result;
  }

  public async updateInstallmentByBenefitIdAndInstallmentId({
    benefitId,
    installmentId,
    user,
    payload,
  }: {
    payload: Prisma.InstallmentUncheckedUpdateManyInput;
    benefitId: number;
    installmentId: number;
    user: string;
  }): Promise<void> {
    const installment =
      await this.installmentRepository.findInstallmentByBenefitIdAndInstallmentId(
        benefitId,
        installmentId,
      );

    if (!installment) {
      throw new NotFoundError(
        'pending installment not found with the provided benefit id and installment id',
      );
    }
    await this.installmentRepository.updateInstallmentByBenefitIdAndInstallmentId(
      benefitId,
      installmentId,
      {
        ...payload,
        updatedAt: new Date(),
        updatedBy: user,
      },
    );
  }
}

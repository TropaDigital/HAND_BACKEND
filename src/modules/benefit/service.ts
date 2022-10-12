import {
  Address,
  Associated,
  BankAccount,
  Benefit,
  BenefitStatus,
  EmploymentRelationship,
  Installment,
  Prisma,
} from '@prisma/client';
import { addMonths, differenceInMonths, endOfMonth } from 'date-fns';

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

    const result = await this.benefitRepository.create({
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
      initialDate: this.formatMonthOfPayment(firstPaymentDates, monthOfPayment),
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
    });
    await this.installmentRepository.createMany(
      [...installments].map(installment => ({ ...installment, createdBy })),
    );

    return result;
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

  public async postponementInstallment(payload: {
    id: number;
    user: string;
  }): Promise<void> {
    const times = await this.benefitRepository.countEditTimes(payload.id);

    if (times > 3) {
      throw new Error('cannot update installment more than 3 times');
    }
    if (times === 3) {
      const installments = await this.installmentRepository.findAll({
        benefitId: payload.id,
      });

      return this.singlePostponementInstallment({
        id: payload.id,
        user: payload.user,
        reference: new Date(installments[0].reference),
      });
    }

    const installments = await this.installmentRepository.findAll({
      benefitId: payload.id,
    });

    await Promise.all(
      installments.map(installment =>
        this.installmentRepository.softUpdate(installment.id, {
          ...installment,
          finalValue: installment.finalValue * (loanConfig.adjustmentFee / 100),
          referenceDate: addMonths(installment.referenceDate, 1),
          user: payload.user,
        }),
      ),
    );
  }

  public async singlePostponementInstallment(payload: {
    id: number;
    reference: Date;
    user: string;
  }): Promise<void> {
    const installment =
      await this.installmentRepository.findByBenefitIdAndReferenceDate(
        payload.id,
        payload.reference,
      );
    const nextInstallment =
      await this.installmentRepository.findByBenefitIdAndReferenceDate(
        payload.id,
        addMonths(payload.reference, 1),
      );

    if (!installment || !nextInstallment) {
      throw new NotFoundError();
    }

    const recalculatedFinalValue = this.recalculateFinalValue(
      installment,
      nextInstallment,
    );

    await this.installmentRepository.softUpdate(installment.id, {
      ...installment,
      finalValue: recalculatedFinalValue,
      referenceDate: addMonths(installment.referenceDate, 1),
      user: payload.user,
    });

    await this.installmentRepository.disable(nextInstallment.id, payload.user);
  }

  private recalculateFinalValue(
    installment: Installment,
    nextInstallment: Installment,
  ) {
    const sumOfInstallmentValue =
      installment.finalValue + nextInstallment.finalValue;
    const result = sumOfInstallmentValue * (loanConfig.adjustmentFee / 100);

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
}

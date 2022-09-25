import {
  Address,
  Associated,
  BankAccount,
  Benefit,
  BenefitStatus,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';
import { addMonths } from 'date-fns';

import { MonthOfPayment } from '../../enums/MonthOfPayment';
import { MissingInvalidParamsError, NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { IAssociatedRepository } from '../associated/interfaces';
import { IInstallmentRepository } from '../installment/interfaces';
import { ILoanSimulationService } from '../loanSimulation/interfaces';
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
  ) {}

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
    } = payload;

    const {
      bankAccounts,
      addresses,
      employmentRelationships,
      affiliations,
      ...associated
    } = (await this.associatedRepository.findById(associatedId)) || {};
    if (!associated) {
      throw new NotFoundError('Associated not found with the provided id');
    }

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

    if (![address, bankAccount, employmentRelationship].every(item => !!item)) {
      throw new MissingInvalidParamsError(
        'the provided data is invalid, please check if the associated was created correctly',
      );
    }

    const {
      consultantCommission,
      isRequestedValueValid,
      totalValue,
      installments,
      firstPaymentDates,
    } = await this.loanSimulationService.simulateLoanBasedOnRequestedValue({
      hasGratification,
      joinedTelemedicine,
      monthOfPayment,
      numberOfInstallments,
      requestedValue,
      salary,
      salaryReceiptDate: new Date(
        new Date().setDate(employmentRelationship.paymentDay),
      ),
      administrationFeeValue,
      consultantId,
    });

    if (!isRequestedValueValid) {
      throw new MissingInvalidParamsError(
        'the conditions of the benefit does not match with the rules, plase check the parameters',
      );
    }

    const {
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

    return result;
  }

  public async postponementInstallment(id: number): Promise<void> {
    const times = await this.benefitRepository.countEditTimes(id);

    if (times > 3) {
      throw new Error('cannot update installment more than 3 times');
    }
    if (times === 3) {
      const installments = await this.installmentRepository.findAll({
        benefitId: id,
      });

      await Promise.all(
        installments.map(installment =>
          this.installmentRepository.softUpdate(installment.id, {
            ...installment,
            referenceDate: addMonths(installment.referenceDate, 1),
            user: '',
          }),
        ),
      );
    }

    const installments = await this.installmentRepository.findAll({
      benefitId: id,
    });

    await this.installmentRepository.softUpdate(installments[0].id, {
      ...installments[0],
      referenceDate: addMonths(installments[0].referenceDate, 1),
      user: '',
    });
  }

  public async singlePostponementInstallment(
    id: number,
    reference: Date,
  ): Promise<void> {
    const installment =
      await this.installmentRepository.findByBenefitIdAndReferenceDate(
        id,
        reference,
      );

    if (!installment) {
      throw new NotFoundError();
    }

    this.installmentRepository.softUpdate(installment.id, {
      ...installment,
      referenceDate: addMonths(installment.referenceDate, 1),
      user: '',
    });
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

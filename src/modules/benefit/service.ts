import {
  Address,
  Associated,
  BankAccount,
  Benefit,
  BenefitStatus,
  BenefitType,
  EmploymentRelationship,
  Prisma,
} from '@prisma/client';

import { MonthOfPayment } from '../../enums/MonthOfPayment';
import { MissingInvalidParamsError, NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import { IAssociatedRepository } from '../associated/interfaces';
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
      salaryReceiptDate,
      administrationFeeValue,
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
      salaryReceiptDate,
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
      contractType: BenefitType.N,
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
            connect: {
              id: consultantId,
            },
          }
        : {}),
    });

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

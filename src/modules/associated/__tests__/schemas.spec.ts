import JoiAdapter from '../../../adapters/joi/JoiAdapter';
import * as schemas from '../schemas';
import {
  makeFakeCreateAssociatedInput,
  makeFakeUpdateAssociatedInput,
} from './helpers/test-helper';

const makeSut = () => {
  const sut = new JoiAdapter(schemas);

  return { sut };
};

describe('Schema', () => {
  describe('GetAssociatedById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('GetAssociatedById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('GetAssociatedById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('CreateAssociated', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = makeFakeCreateAssociatedInput();

      const result = sut.validateSchema('CreateAssociated', param);

      expect(result).toEqual({
        addresses: [
          {
            addressType: 'any_type',
            city: 'any_city',
            complement: 'any_complements',
            district: 'any_district',
            houseNumber: 'any_number',
            postalCode: 'any_postal_code',
            state: 'any_state',
            street: 'any_street',
          },
        ],
        affiliations: [
          {
            id: 1,
          },
        ],
        bankAccounts: [
          {
            accountNumber: 'any_account',
            accountType: 'any_type',
            agency: '0000',
            bank: '00 - Any Bank',
            pixKey: 'any_pix_key',
            pixType: 'any_type',
          },
        ],
        birthDate: new Date('2022-04-15T00:00:00.000Z'),
        cellPhone: '00-0000000',
        createdBy: 'any_data',
        email: 'any@email.com',
        emissionDate: new Date('2022-04-15T00:00:00.000Z'),
        emissionState: 'any_state',
        employmentRelationships: [
          {
            contractType: 'contract_type',
            finalDate: new Date('2022-04-15T00:00:00.000Z'),
            isDefault: true,
            occupation: 'any_occupation',
            paymentDay: 5,
            publicAgency: 'any_agency',
            registerNumber: 'any_register_number',
            salary: 'any_salary',
          },
        ],
        father: 'any_father',
        gender: 'any_gender',
        issuingAgency: 'any_agency',
        lastName: 'any_last_name',
        maritalStatus: 'any_marital_status',
        mother: 'any_mother',
        name: 'any_name',
        nationality: 'any_nationality',
        partner: 'partner',
        placeOfBirth: 'any_place',
        registerId: 'any_register_id',
        taxId: '000.000.000-00',
      });
    });

    it('should throw when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = {
        name: 1,
        taxId: 2,
        city: 2,
        state: 1,
        commission: '10',
        createdBy: 2,
      };

      expect(() => sut.validateSchema('CreateAssociated', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('UpdateAssociatedById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 777, ...makeFakeUpdateAssociatedInput() };

      const result = sut.validateSchema('UpdateAssociatedById', param);

      expect(result).toEqual({
        addresses: [
          {
            addressType: 'any_type',
            city: 'any_city',
            complement: 'any_complements',
            district: 'any_district',
            houseNumber: 'any_number',
            postalCode: 'any_postal_code',
            state: 'any_state',
            street: 'any_street',
          },
        ],
        affiliations: [
          {
            id: 1,
            name: 'USER',
          },
        ],
        bankAccounts: [
          {
            accountNumber: 'any_account',
            accountType: 'any_type',
            agency: '0000',
            bank: '00 - Any Bank',
            pixKey: 'any_pix_key',
            pixType: 'any_type',
          },
        ],
        birthDate: new Date('2022-04-15T00:00:00.000Z'),
        cellPhone: '00-0000000',
        createdBy: 'any_data',
        email: 'any@email.com',
        emissionDate: new Date('2022-04-15T00:00:00.000Z'),
        emissionState: 'any_state',
        employmentRelationships: [
          {
            contractType: 'contract_type',
            finalDate: new Date('2022-04-15T00:00:00.000Z'),
            isDefault: true,
            occupation: 'any_occupation',
            paymentDay: 5,
            publicAgency: 'any_agency',
            registerNumber: 'any_register_number',
            salary: 'any_salary',
          },
        ],
        father: 'any_father',
        gender: 'any_gender',
        id: 777,
        issuingAgency: 'any_agency',
        lastName: 'any_last_name',
        maritalStatus: 'any_marital_status',
        mother: 'any_mother',
        name: 'any_name',
        nationality: 'any_nationality',
        partner: 'partner',
        placeOfBirth: 'any_place',
        registerId: 'any_register_id',
        taxId: '000.000.000-00',
      });
    });

    it('should throw when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = {
        name: 1,
        taxId: 2,
        city: 2,
        state: 1,
        commission: '10',
        createdBy: 2,
      };

      expect(() => sut.validateSchema('UpdateAssociatedById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });

  describe('DeleteAssociatedById', () => {
    it('should success when receive a valid input', () => {
      const { sut } = makeSut();
      const param = { id: 2 };

      const result = sut.validateSchema('DeleteAssociatedById', param);

      expect(result).toEqual(param);
    });

    it('should return error when an invalid input is provided', () => {
      const { sut } = makeSut();
      const param = { id: '' };

      expect(() => sut.validateSchema('DeleteAssociatedById', param)).toThrow(
        new Error('Missing or invalid param'),
      );
    });
  });
});

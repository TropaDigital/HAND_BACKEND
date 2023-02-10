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

      expect(result).toEqual(makeFakeCreateAssociatedInput());
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
        affiliations: [
          {
            id: 1,
            name: 'USER',
          },
        ],
        birthDate: new Date('2022-04-15T00:00:00.000Z'),
        email: 'any@email.com',
        emissionDate: new Date('2022-04-15T00:00:00.000Z'),
        emissionState: 'any_state',
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

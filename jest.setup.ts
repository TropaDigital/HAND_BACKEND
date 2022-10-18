import { startOfDay } from 'date-fns';

jest
  .useFakeTimers()
  .setSystemTime(startOfDay(new Date('2022-04-15T12:00:00.000Z')).getTime());

beforeEach(() => {
  // Temporarily allow us to alter timezone calculation for testing
  /*eslint no-extend-native: "off"*/
  Date.prototype.getTimezoneOffset = jest.fn(() => 73);
});

afterEach(() => {
  jest.restoreAllMocks();
});

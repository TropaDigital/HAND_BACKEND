import { startOfDay } from 'date-fns';

jest.useFakeTimers().setSystemTime(startOfDay(new Date('2022-04-15T12:00:00.900Z')).getTime());

afterEach(() => {
  jest.restoreAllMocks();
});

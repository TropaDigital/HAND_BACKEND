jest.useFakeTimers().setSystemTime(new Date('1912-06-23').getTime());

afterEach(() => {
  jest.restoreAllMocks();
});

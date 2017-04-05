import AppEvents from '../../src/client/app-events';

test('communicates as singleton', () => {
  const testEventName = 'test-event';
  let testEventCalled = false;

  const appEvents1 = new AppEvents();

  appEvents1.on(testEventName, () => {
    testEventCalled = true;
  });

  const appEvents2 = new AppEvents();

  appEvents2.emit(testEventName);

  expect(testEventCalled).toBe(true);
});

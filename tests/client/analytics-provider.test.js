import AnalyticsProvider from '../../src/client/analytics-provider';

beforeEach(() => {
  new AnalyticsProvider(null, false).appEvents.removeAllListeners();
});

test('beginTracking does not wire up event listeners when no trackingId specified', () => {
  const analyticsProvider = new AnalyticsProvider(null, false);

  const result = analyticsProvider.beginTracking();

  expect(result).toBe(false);
});

test('beginTracking wires up event listeners when trackingId specified', () => {
  const analyticsProvider = new AnalyticsProvider('some-tracking-id', false);

  const result = analyticsProvider.beginTracking();

  expect(result).toBe(true);
});

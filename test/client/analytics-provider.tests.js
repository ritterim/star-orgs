import test from 'ava';

import AnalyticsProvider from '../../src/client/analytics-provider';

test.beforeEach(() => {
  new AnalyticsProvider(null, false).appEvents.removeAllListeners();
});

test.serial('beginTracking does not wire up event listeners when no trackingId specified', t => {
  const analyticsProvider = new AnalyticsProvider(null, false);

  const result = analyticsProvider.beginTracking();

  t.false(result);
});

test.serial('beginTracking wires up event listeners when trackingId specified', t => {
  const analyticsProvider = new AnalyticsProvider('some-tracking-id', false);

  const result = analyticsProvider.beginTracking();

  t.true(result);
});

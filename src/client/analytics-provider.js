/* global ga:false */

import AppEvents from './app-events';

export default class AnalyticsProvider {
  constructor(trackingId, performGoogleAnalyticsWireup = true) {
    this.appEvents = new AppEvents();
    this.trackingId = trackingId;
    this.performGoogleAnalyticsWireup = performGoogleAnalyticsWireup;
  }

  beginTracking() {
    if (!this.trackingId) {
      return false;
    }

    if (this.performGoogleAnalyticsWireup) {
      /* eslint-disable */
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', this.trackingId, 'auto');
      ga('send', 'pageview');
      /* eslint-enable */
    }

    this.wireUpEventListener('orgChartSvg:circleSelect', 'Chart', 'CircleSelect');
    this.wireUpEventListener('orgChartSidebar:toggleDepartment', 'Sidebar', 'ToggleDepartment');
    this.wireUpEventListener('orgChartSidebar:toggleLocation', 'Sidebar', 'ToggleLocation');
    this.wireUpEventListener('orgChartSidebar:searchActivated', 'Sidebar', 'SearchActivated');

    return true;
  }

  wireUpEventListener(eventType, eventCategory, eventAction, eventLabel, eventValue) {
    this.appEvents.on(
      eventType,

      // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
      () => {
        if (this.performGoogleAnalyticsWireup) {
          ga('send', 'event', eventCategory, eventAction, eventLabel, eventValue);
        }
      });
  }
}

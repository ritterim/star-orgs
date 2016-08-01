import AppEvents from './app-events';
import Directory from './directory';
import ForceDirectedGraphRenderer from './force-directed-graph-renderer';
import AnalyticsProvider from './analytics-provider';

const containerElement = document.getElementById('js-content-container');
const directoryUrl = 'directory';
const trackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID;

const directory = new Directory();
const renderer = new ForceDirectedGraphRenderer(containerElement);
const analytics = new AnalyticsProvider(trackingId);

const jsRecordCount = document.getElementById('js-record-count');
const jsSearchInput = document.getElementById('js-search-input');

directory
  .getUsers(directoryUrl)
  .then(users => {
    jsRecordCount.innerHTML = users.length;
    renderer.render(users);
  });

const appEvents = new AppEvents();

jsSearchInput.onfocus = () => {
  appEvents.emit('orgChartSidebar:searchActivated');
  jsSearchInput.select();
};
jsSearchInput.onkeyup = ev => renderer.search(ev.target.value);

analytics.beginTracking();

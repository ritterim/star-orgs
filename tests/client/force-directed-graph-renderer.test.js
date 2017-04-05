/* eslint-disable no-magic-numbers */

import AppEvents from '../../src/client/app-events';
import ForceDirectedGraphRenderer from '../../src/client/force-directed-graph-renderer';

beforeEach(() => {
  const groupByDepartment = document.createElement('div');
  const groupByLocation = document.createElement('div');

  groupByDepartment.id = 'js-group-by-department';
  groupByLocation.id = 'js-group-by-location';

  document.documentElement.appendChild(groupByDepartment);
  document.documentElement.appendChild(groupByLocation);
});

test('render should add svg to containerElement', () => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    false);

  renderer.render([]);

  expect(document.getElementsByTagName('svg').length).toBe(1);
});

// This test requires constructing DOM elements
// or making additional changes to the class being tested.
// todo('render should wire orgChartSvg:circleSelect event');

test('render should wire orgChartSidebar:toggleDepartment event', () => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    false);

  renderer.render([]);

  let eventTriggered = false;

  const appEvents = new AppEvents();

  appEvents.on('orgChartSidebar:toggleDepartment', () => {
    eventTriggered = true;
  });

  const groupByDepartment = document.getElementById('js-group-by-department');

  groupByDepartment.onchange(null);

  expect(eventTriggered).toBe(true);
});

test('render should wire orgChartSidebar:toggleLocation event', () => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    false);

  renderer.render([]);

  let eventTriggered = false;

  const appEvents = new AppEvents();

  appEvents.on('orgChartSidebar:toggleLocation', () => {
    eventTriggered = true;
  });

  const groupByDepartment = document.getElementById('js-group-by-location');

  groupByDepartment.onchange(null);

  expect(eventTriggered).toBe(true);
});

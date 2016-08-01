/* eslint-disable no-magic-numbers */

import test from 'ava';

import AppEvents from '../../src/client/app-events';
import ForceDirectedGraphRenderer from '../../src/client/force-directed-graph-renderer';

test.beforeEach(() => {
  const groupByDepartment = document.createElement('div');
  const groupByLocation = document.createElement('div');

  groupByDepartment.id = 'js-group-by-department';
  groupByLocation.id = 'js-group-by-location';

  document.documentElement.appendChild(groupByDepartment);
  document.documentElement.appendChild(groupByLocation);
});

test('render should add svg to containerElement', t => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    false);

  renderer.render([]);

  t.is(document.getElementsByTagName('svg').length, 1);
});

// This test requires constructing DOM elements
// or making additional changes to the class being tested.
test.todo('render should wire orgChartSvg:circleSelect event');

test('render should wire orgChartSidebar:toggleDepartment event', t => {
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

  t.true(eventTriggered);
});

test('render should wire orgChartSidebar:toggleLocation event', t => {
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

  t.true(eventTriggered);
});

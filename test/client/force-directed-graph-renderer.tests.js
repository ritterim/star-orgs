/* eslint-disable no-magic-numbers */

import test from 'ava';

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

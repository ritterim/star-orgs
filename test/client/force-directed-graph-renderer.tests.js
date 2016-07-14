/* eslint-disable no-magic-numbers */

import test from 'ava';

import ForceDirectedGraphRenderer from '../../src/client/force-directed-graph-renderer';

test('render should add svg to containerElement', t => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    false);

  renderer.render([]);

  t.is(document.getElementsByTagName('svg').length, 1);
});

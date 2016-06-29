/* eslint-disable no-magic-numbers */

import test from 'ava';

import ForceDirectedGraphRenderer from '../../src/client/force-directed-graph-renderer';

export class TestImageRetriever {
  getImageUrl() {
    return null;
  }
}

test('render should add svg to containerElement', t => {
  const renderer = new ForceDirectedGraphRenderer(
    document.documentElement,
    new TestImageRetriever(),
    false);

  renderer.render([]);

  t.is(document.getElementsByTagName('svg').length, 1);
});

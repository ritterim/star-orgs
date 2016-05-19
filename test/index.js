import test from 'ava';
import 'babel-core/register';

import starOrgs from '../src/lib/';

test('starOrgs', (t) => {
  t.is(starOrgs(), true);
});

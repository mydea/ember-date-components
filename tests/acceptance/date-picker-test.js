import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | date picker');

test('visiting /date-picker', function(assert) {
  visit('/examples/date-picker');

  andThen(function() {
    assert.equal(currentURL(), '/examples/date-picker');
    assert.equal(find('#date1-output').text().trim(), '', 'date 1 is empty');
    assert.equal(find('#date2-output').text().trim(), '01/01/2015', 'date 2 is correctly pre-filled');
  });
});

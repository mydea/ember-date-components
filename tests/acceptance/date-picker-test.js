import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { getDatePicker } from 'ember-date-components/test-support/helpers/date-picker';
import moment from 'moment';

module('Acceptance | date picker', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /date-picker', async function(assert) {
    await visit('/examples/date-picker');

    assert.equal(currentURL(), '/examples/date-picker');
    assert.dom('#date1-output').hasText('', 'date 1 is empty');
    assert.dom('#date2-output').hasText('01/01/2015', 'date 2 is correctly pre-filled');

    let datePicker = getDatePicker('#date-picker-1');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(12));

    assert.dom('#date1-output').hasText(moment().date(12).format('L'), 'date 1 is correctly updated.');
  });
});

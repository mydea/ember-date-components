import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import interactWithDatePicker from 'ember-date-components/helpers/interact-with-date-picker';
import moment from 'moment';

moduleForAcceptance('Acceptance | date picker');

test('visiting /date-picker', function(assert) {
  visit('/examples/date-picker');

  andThen(function() {
    assert.equal(currentURL(), '/examples/date-picker');
    assert.equal(find('#date1-output').text().trim(), '', 'date 1 is empty');
    assert.equal(find('#date2-output').text().trim(), '01/01/2015', 'date 2 is correctly pre-filled');

    let datePicker = interactWithDatePicker($('#date-picker-1'));
    datePicker.toggle();
    datePicker.select(moment().date(12));
  });

  andThen(function() {
    assert.equal(find('#date1-output').text().trim(), moment().date(12).format('L'), 'date 1 is correctly updated.');
  });
});

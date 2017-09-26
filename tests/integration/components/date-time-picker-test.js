import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import interactWithDatePicker from 'ember-date-components/helpers/interact-with-date-picker';
import moment from 'moment';
import $ from 'jquery';

function setTimePickerValue($el, val) {
  let $timeInput = $el.find('input');
  $timeInput.val(val).trigger('keyup');
  /* eslint-disable new-cap */
  let enterEvent = $.Event('keyup');
  /* eslint-enable new-cap */
  enterEvent.which = 13;
  enterEvent.keyCode = 13;
  $timeInput.trigger(enterEvent);
}

moduleForComponent('date-time-picker', 'Integration | Component | date time picker', {
  integration: true
});

test('time picker is disabled if no value is set', function(assert) {
  this.render(hbs`{{date-time-picker}}`);
  assert.ok(this.$().find('input').attr('disabled'));
});

test('selecting a time works with a value pre-set', function(assert) {
  assert.expect(8);

  let today = moment();

  this.on('update', function(val) {
    assert.equal(val.hours(), 14, 'hours are correct');
    assert.equal(val.minutes(), 30, 'minutes are correct');
    assert.equal(val.seconds(), 0, 'seconds are correct');
    assert.equal(val.milliseconds(), 0, 'ms are correct');

    assert.equal(val.year(), today.year(), 'year remains the same');
    assert.equal(val.month(), today.month(), 'month remains the same');
    assert.equal(val.date(), today.date(), 'date remains the same');

    assert.equal(this.get('value'), today, 'the value is not modified');
  });

  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value action=(action 'update')}}`);

  setTimePickerValue(this.$(), '14:30');
});

test('time picker is disabled if disabled=true', function(assert) {
  this.render(hbs`{{date-time-picker disabled=true value=(now)}}`);
  assert.ok(this.$().find('input').attr('disabled'));
});

test('time-picker value is pre-filled', function(assert) {
  let today = moment().hours(14).minutes(30).seconds(0).milliseconds(0);

  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value}}`);

  assert.equal(this.$().find('input').val(), '02:30 pm');
});

test('ignoreZeroTime works', function(assert) {
  let today = moment();
  today.hours(0);
  today.minutes(0);
  today.seconds(0);
  today.milliseconds(0);

  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value}}`);

  assert.equal(this.$().find('input').val(), '', 'value is empty if time is 00:00');
});

test('ignoreZeroTime can be disabled', function(assert) {
  let today = moment();
  today.hours(0);
  today.minutes(0);
  today.seconds(0);
  today.milliseconds(0);

  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value ignoreZeroTime=false}}`);

  assert.equal(this.$().find('input').val(), '12:00 am', 'value is 00:00 if ignoreZeroTime=false');
});

test('date picker is not disabled if no value is set', function(assert) {
  this.render(hbs`{{date-time-picker}}`);
  let datePicker = interactWithDatePicker(this.$());
  assert.notOk(datePicker.buttonElement.attr('disabled'));
});

test('date picker is disabled if disabled=true', function(assert) {
  this.render(hbs`{{date-time-picker disabled=true value=(now)}}`);

  let datePicker = interactWithDatePicker(this.$());
  assert.ok(datePicker.buttonElement.attr('disabled'));
});

test('selecting a date works without a value pre-set', function(assert) {
  assert.expect(8);

  let today = moment('2017-05-13');

  this.on('update', function(val) {
    assert.equal(val.hours(), today.hours(), 'hours remain the same');
    assert.equal(val.minutes(), today.minutes(), 'minutes remain the same');
    assert.equal(val.seconds(), today.seconds(), 'seconds remain the same');
    assert.equal(val.milliseconds(), today.milliseconds(), 'ms remain the same');

    assert.equal(val.year(), 2017, 'year is correct');
    assert.equal(val.month(), 4, 'month is correct');
    assert.equal(val.date(), 6, 'date is correct');

    assert.equal(this.get('value'), today, 'the value is not modified');
  });

  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value action=(action 'update')}}`);

  let datePicker = interactWithDatePicker(this.$());
  datePicker.toggle();
  datePicker.select(moment('2017-05-06'));
});

test('selecting a date works with a value pre-set', function(assert) {
  assert.expect(7);

  let today = moment();

  this.on('update', function(val) {
    assert.equal(val.hours(), 0, 'hours defaults to 0');
    assert.equal(val.minutes(), 0, 'minutes defaults to 0');
    assert.equal(val.seconds(), 0, 'seconds defaults to 0');
    assert.equal(val.milliseconds(), 0, 'ms defaults to 0');

    assert.equal(val.year(), today.year(), 'year is correct');
    assert.equal(val.month(), today.month(), 'month is correct');
    assert.equal(val.date(), today.date(), 'date is correct');
  });

  this.render(hbs`{{date-time-picker action=(action 'update')}}`);

  let datePicker = interactWithDatePicker(this.$());
  datePicker.toggle();
  datePicker.select(today);
});

test('date-picker value is pre-filled', function(assert) {
  let today = moment('2017-05-13');
  this.set('value', today);
  this.render(hbs`{{date-time-picker value=value}}`);

  let datePicker = interactWithDatePicker(this.$());
  assert.equal(datePicker.buttonText(), today.format('L'));
});

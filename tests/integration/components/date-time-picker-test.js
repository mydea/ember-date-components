import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { interactWithDatePicker, setTimePickerValue } from 'ember-date-components/helpers/interact-with-date-picker';
import moment from 'moment';
import { get, set } from '@ember/object';

module('Integration | Component | date time picker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('time picker is disabled if no value is set', async function(assert) {
    await render(hbs`{{date-time-picker}}`);
    assert.dom('input').hasAttribute('disabled');
  });

  test('selecting a time works with a value pre-set', async function(assert) {
    assert.expect(8);

    let today = moment();

    this.actions.update = function(val) {
      assert.equal(val.hours(), 14, 'hours are correct');
      assert.equal(val.minutes(), 30, 'minutes are correct');
      assert.equal(val.seconds(), 0, 'seconds are correct');
      assert.equal(val.milliseconds(), 0, 'ms are correct');

      assert.equal(val.year(), today.year(), 'year remains the same');
      assert.equal(val.month(), today.month(), 'month remains the same');
      assert.equal(val.date(), today.date(), 'date remains the same');

      assert.equal(get(this, 'value'), today, 'the value is not modified');
    };

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value action=(action 'update')}}`);

    await setTimePickerValue(this.element, '14:30');
  });

  test('time picker is disabled if disabled=true', async function(assert) {
    await render(hbs`{{date-time-picker disabled=true value=(now)}}`);
    assert.dom('input').hasAttribute('disabled');
  });

  test('time-picker value is pre-filled', async function(assert) {
    let today = moment().hours(14).minutes(30).seconds(0).milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    assert.dom('input').hasValue('02:30 pm');
  });

  test('ignoreZeroTime works', async function(assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    assert.dom('input').hasValue('', 'value is empty if time is 00:00');
  });

  test('ignoreZeroTime can be disabled', async function(assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value ignoreZeroTime=false}}`);

    assert.dom('input').hasValue('12:00 am', 'value is 00:00 if ignoreZeroTime=false');
  });

  test('date picker is not disabled if no value is set', async function(assert) {
    await render(hbs`{{date-time-picker}}`);
    let datePicker = interactWithDatePicker(this.element);
    assert.dom(datePicker.buttonElement).doesNotHaveAttribute('disabled');
  });

  test('date picker is disabled if disabled=true', async function(assert) {
    await render(hbs`{{date-time-picker disabled=true value=(now)}}`);

    let datePicker = interactWithDatePicker(this.element);
    assert.dom(datePicker.buttonElement).hasAttribute('disabled');
  });

  test('selecting a date works without a value pre-set', async function(assert) {
    assert.expect(8);

    let today = moment('2017-05-13');

    this.actions.update = function(val) {
      assert.equal(val.hours(), today.hours(), 'hours remain the same');
      assert.equal(val.minutes(), today.minutes(), 'minutes remain the same');
      assert.equal(val.seconds(), today.seconds(), 'seconds remain the same');
      assert.equal(val.milliseconds(), today.milliseconds(), 'ms remain the same');

      assert.equal(val.year(), 2017, 'year is correct');
      assert.equal(val.month(), 4, 'month is correct');
      assert.equal(val.date(), 6, 'date is correct');

      assert.equal(get(this, 'value'), today, 'the value is not modified');
    };

    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value action=(action 'update')}}`);

    let datePicker = interactWithDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.select(moment('2017-05-06'));
  });

  test('selecting a date works with a value pre-set', async function(assert) {
    assert.expect(7);

    let today = moment();

    this.actions.update = function(val) {
      assert.equal(val.hours(), 0, 'hours defaults to 0');
      assert.equal(val.minutes(), 0, 'minutes defaults to 0');
      assert.equal(val.seconds(), 0, 'seconds defaults to 0');
      assert.equal(val.milliseconds(), 0, 'ms defaults to 0');

      assert.equal(val.year(), today.year(), 'year is correct');
      assert.equal(val.month(), today.month(), 'month is correct');
      assert.equal(val.date(), today.date(), 'date is correct');
    };

    await render(hbs`{{date-time-picker action=(action 'update')}}`);

    let datePicker = interactWithDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.select(today);
  });

  test('date-picker value is pre-filled', async function(assert) {
    let today = moment('2017-05-13');
    set(this, 'value', today);
    await render(hbs`{{date-time-picker value=value}}`);

    let datePicker = interactWithDatePicker(this.element);
    assert.equal(datePicker.buttonText(), today.format('L'));
  });
});

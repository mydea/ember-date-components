import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import {
  getDatePicker,
  selectDateTime,
} from 'ember-date-components/test-support/helpers/date-picker';
import { selectTime } from 'ember-date-components/test-support/helpers/time-picker';
import moment from 'moment';

module('Integration | Component | date time picker', function (hooks) {
  setupRenderingTest(hooks);

  test('time picker is disabled if no value is set', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @onChange={{this.onChange}} 
      />
    `);

    assert.dom('[data-time-picker-toggle-button]').isDisabled();
  });

  test('selecting a time works with a value pre-set', async function (assert) {
    let today = moment();

    this.onChange = function (val) {
      assert.equal(val.hours(), 14, 'hours are correct');
      assert.equal(val.minutes(), 30, 'minutes are correct');
      assert.equal(val.seconds(), 0, 'seconds are correct');
      assert.equal(val.milliseconds(), 0, 'ms are correct');

      assert.equal(val.year(), today.year(), 'year remains the same');
      assert.equal(val.month(), today.month(), 'month remains the same');
      assert.equal(val.date(), today.date(), 'date remains the same');

      assert.equal(this.value, today, 'the value is not modified');

      assert.step('onChange is called');
    };

    this.value = today;

    await render(hbs`
      <DateTimePicker
        @value={{this.value}} 
        @onChange={{this.onChange}} 
      />
    `);

    await selectTime(this.element, '14:30');

    assert.verifySteps(['onChange is called']);
  });

  test('time picker is disabled if disabled=true', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @onChange={{this.onChange}} 
        @disabled={{true}}
      />
    `);

    assert.dom('[data-time-picker-toggle-button]').isDisabled();
  });

  test('time-picker value is pre-filled', async function (assert) {
    let today = moment().hours(14).minutes(30).seconds(0).milliseconds(0);

    this.value = today;

    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @onChange={{this.onChange}} 
      />
    `);

    assert.dom('[data-time-picker-toggle-button]').hasText('02:30 pm');
  });

  test('ignoreZeroTime works', async function (assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    this.value = today;

    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @onChange={{this.onChange}} 
      />
    `);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasText('Enter time...', 'value is empty if time is 00:00');
  });

  test('ignoreZeroTime can be disabled', async function (assert) {
    let today = moment();
    today.hours(0);
    today.minutes(0);
    today.seconds(0);
    today.milliseconds(0);

    this.value = today;

    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @ignoreZeroTime={{false}}
        @onChange={{this.onChange}} 
      />
    `);

    assert
      .dom('[data-time-picker-toggle-button]')
      .hasText('12:00 am', 'value is 00:00 if ignoreZeroTime=false');
  });

  test('date picker is not disabled if no value is set', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @onChange={{this.onChange}} 
      />
    `);

    let datePicker = getDatePicker(this.element);
    assert.dom(datePicker.buttonElement).isNotDisabled();
  });

  test('date picker is disabled if disabled=true', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @disabled={{true}}
        @value={{now}}
        @onChange={{this.onChange}} 
      />
    `);

    let datePicker = getDatePicker(this.element);
    assert.dom(datePicker.buttonElement).hasAttribute('disabled');
  });

  test('selecting a date works without a value pre-set', async function (assert) {
    let today = moment('2017-05-13');

    this.onChange = function (val) {
      assert.equal(val.hours(), today.hours(), 'hours remain the same');
      assert.equal(val.minutes(), today.minutes(), 'minutes remain the same');
      assert.equal(val.seconds(), today.seconds(), 'seconds remain the same');
      assert.equal(
        val.milliseconds(),
        today.milliseconds(),
        'ms remain the same'
      );

      assert.equal(val.year(), 2017, 'year is correct');
      assert.equal(val.month(), 4, 'month is correct');
      assert.equal(val.date(), 6, 'date is correct');

      assert.equal(this.value, today, 'the value is not modified');

      assert.step('onChange is called');
    };

    this.value = today;

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @onChange={{this.onChange}} 
      />
    `);

    let datePicker = getDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.selectDate(moment('2017-05-06'));

    assert.verifySteps(['onChange is called']);
  });

  test('selecting a date works with a value pre-set', async function (assert) {
    let today = moment();

    this.onChange = function (val) {
      assert.equal(val.hours(), 0, 'hours defaults to 0');
      assert.equal(val.minutes(), 0, 'minutes defaults to 0');
      assert.equal(val.seconds(), 0, 'seconds defaults to 0');
      assert.equal(val.milliseconds(), 0, 'ms defaults to 0');

      assert.equal(val.year(), today.year(), 'year is correct');
      assert.equal(val.month(), today.month(), 'month is correct');
      assert.equal(val.date(), today.date(), 'date is correct');

      assert.step('onChange is called');
    };

    await render(hbs`
      <DateTimePicker 
        @onChange={{this.onChange}} 
      />
    `);

    let datePicker = getDatePicker(this.element);
    await datePicker.toggle();
    await datePicker.selectDate(today);

    assert.verifySteps(['onChange is called']);
  });

  test('date-picker value is pre-filled', async function (assert) {
    let today = moment('2017-05-13');
    this.value = today;

    this.onChange = () => {};

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @onChange={{this.onChange}} 
      />
    `);

    let datePicker = getDatePicker(this.element);
    assert.equal(datePicker.buttonText(), today.format('L'));
  });

  test('setDateTime test helpers works', async function (assert) {
    this.onChange = (val) => {
      this.set('value', val);

      assert.step('onChange is called');
    };

    this.value = null;

    await render(hbs`
      <DateTimePicker 
        @value={{this.value}}
        @onChange={{this.onChange}} 
      />
    `);

    let targetDate = moment().add(2, 'day').hours(5).minutes(30);
    await selectDateTime(this.element, targetDate);

    assert.ok(
      this.value.format('YYYY-MM-DD HH:mm'),
      targetDate.format('YYYY-MM-DD HH:mm'),
      'date is correctly updated'
    );

    assert.verifySteps(['onChange is called', 'onChange is called']);
  });
});

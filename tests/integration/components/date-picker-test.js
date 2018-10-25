import { run, next } from '@ember/runloop';
import { typeOf as getTypeOf } from '@ember/utils';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { getDatePicker, selectDate, getSelectedDate } from 'ember-date-components/test-support/helpers/date-picker';
import { get, set } from '@ember/object';

module('Integration | Component | date picker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders with no attribute set', async function(assert) {
    await render(hbs`{{date-picker}}`);

    assert.dom('[data-test-date-picker-toggle-button]').exists();
    assert.dom('[data-test-date-picker-toggle-button]').hasText('Select Date...', 'Default placeholder is displayed in button.');
  });

  test('default value works', async function(assert) {
    let date = moment();
    set(this, 'defaultDate', date);
    await render(hbs`{{date-picker value=defaultDate}}`);

    assert.dom('[data-test-date-picker-toggle-button]').exists();
    assert.dom('[data-test-date-picker-toggle-button]').hasText(date.format('L'), 'Formatted value of default date is displayed in button.');
  });

  test('action is sent on value change', async function(assert) {
    assert.expect(3);

    this.actions.updateDate = function(date) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(date.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed to action.');
    };
    await render(hbs`{{date-picker action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('default value is not muted after change of date', async function(assert) {
    assert.expect(2);

    let date = moment();
    set(this, 'defaultDate', date);
    this.actions.updateDate = (newDate) => {
      assert.equal(newDate.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed to action.');
      assert.equal(get(this, 'defaultDate'), date, 'original default date is not changed.');
    };
    await render(hbs`{{date-picker value=defaultDate action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));
  });

  test('value updates if bound value changes', async function(assert) {
    let date = moment();
    set(this, 'defaultDate', date);
    await render(hbs`{{date-picker value=defaultDate}}`);

    assert.dom('[data-test-date-picker-toggle-button]').hasText(date.format('L'), 'Formatted value of default date is displayed in button.');

    run(() => {
      date = moment().add(1, 'day');
      set(this, 'defaultDate', date);
    });

    assert.dom('[data-test-date-picker-toggle-button]').hasText(date.format('L'), 'value in date picker is updated.');
  });

  test('date picker shows month of value if set', async function(assert) {
    let date = moment().add(2, 'months');
    set(this, 'defaultDate', date);
    await render(hbs`{{date-picker value=defaultDate}}`);

    assert.dom('[data-test-date-picker-toggle-button]').hasText(date.format('L'), 'Formatted value of default date is displayed in button.');
    run(() => {
      date = moment().add(1, 'day');
      set(this, 'defaultDate', date);
    });
    assert.dom('[data-test-date-picker-toggle-button]').hasText(date.format('L'), 'value in date picker is updated.');
  });

  test('calendar displays week starting on Monday', async function(assert) {
    await render(hbs`{{date-picker}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert.dom('.date-picker .date-picker__weekday:first-child').hasText('Mo', 'first week day is Monday');
  });

  test('calendar displays week starting on Sunday', async function(assert) {
    await render(hbs`{{date-picker startWeekOnSunday=true}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert.dom('.date-picker .date-picker__weekday:first-child').hasText('Su', 'first week day is Sunday');
  });

  test('date-range picker action works', async function(assert) {
    assert.expect(10);

    let counter = 0;
    this.actions.updateDate = function(dates) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(getTypeOf(dates), 'array', 'array is passed');

      let [from, to] = dates;

      if (counter === 0) {
        assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
        assert.equal(to, null, 'to-date is null');
      } else {
        assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
        assert.equal(to.format('YYYY-MM-DD'), moment().date(14).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

        next(() => {
          assert.notOk(datePicker.isOpen(), 'date picker is closed after to-selection.');
        });
      }
      counter++;
    };

    await render(hbs`{{date-picker range=true action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert.ok(datePicker.isOpen(), 'date picker is not closed after from-selection.');

    await datePicker.selectDate(moment().date(14));
  });

  test('date-range allows selection of to-value without from-value', async function(assert) {
    assert.expect(4);

    this.actions.updateDate = function(dates) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(getTypeOf(dates), 'array', 'array is passed');

      let [from, to] = dates;
      assert.equal(from, null, 'from-date is null');
      assert.equal(to.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

    };
    await render(hbs`{{date-picker range=true action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggleTo();
    await datePicker.selectDate(moment().date(7));
  });

  test('date-range picker closeAction works', async function(assert) {
    assert.expect(6);

    this.actions.updateDate = function(dates) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(getTypeOf(dates), 'array', 'array is passed');

      let [from, to] = dates;
      assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
      assert.equal(to.format('YYYY-MM-DD'), moment().date(14).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

      next(() => {
        assert.notOk(datePicker.isOpen(), 'date picker is closed after to-selection.');
      });
    };
    await render(hbs`{{date-picker range=true closeAction=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert.ok(datePicker.isOpen(), 'date picker is not closed after from-selection.');

    await datePicker.selectDate(moment().date(14));
  });

  test('`renderPlace` correctly rendered', async function(assert) {
    set(this, 'renderInPlace', true);
    await render(hbs`{{date-picker renderInPlace=renderInPlace}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert.dom('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--in-place', 'The trigger has a special `--in-place` class');
  });

  test('yielding a button works', async function(assert) {
    let date = moment();
    set(this, 'defaultDate', date);
    await render(hbs`{{#date-picker value=defaultDate}}<button class='test1'>Button</button>{{/date-picker}}`);

    assert.dom('.test1').exists('Custom Button is displayed');

    // Check if correct date is selected
    await click('.test1');
    assert.dom('.date-picker__day--selected').exists();
    assert.dom('.date-picker__day--selected').hasAttribute('data-test-date-picker-day', `${date.year()}-${date.month()}-${date.date()}`);
  });

  test('the yielded content receives the array of selected dates as values', async function(assert) {
    let date = moment();
    set(this, 'defaultDate', date);
    await render(hbs`{{#date-picker
      value=defaultDate
    as |values|}}
      {{#each values as |value|}}
        <div class='test-values'>{{if value (moment-format value 'YYYY-MM-DD')}}</div>
      {{/each}}
    {{/date-picker}}`);

    assert.dom('.test-values').exists({ count: 1 }, 'one value is yielded for regular date pickers');
    assert.dom('.test-values').hasText(date.format('YYYY-MM-DD'), 'correct date is yielded');
  });

  test('the yielded content receives the array of selected dates as values (date-range)', async function(assert) {
    let date = moment();
    set(this, 'defaultDates', [date, null]);
    await render(hbs`{{#date-picker
      value=defaultDates
      range=true
    as |values|}}
      {{#each values as |value|}}
        <div class='test-values'>{{if value (moment-format value 'YYYY-MM-DD')}}</div>
      {{/each}}
    {{/date-picker}}`);

    assert.dom('.test-values').exists({ count: 2 }, 'two values are yielded for date range pickers');
    assert.dom('.test-values:nth-child(1)').hasText(date.format('YYYY-MM-DD'), 'correct date is yielded');
    assert.dom('.test-values:nth-child(2)').hasText('', 'correct date is yielded');
  });

  test('Submitting disabled dates disables those dates on the date picker', async function(assert) {
    let date1 = moment();
    // We use tomorrow as the second day, except for the case where tomorrow is in the next month
    let date2 = moment().add(1, 'day').month() === date1.month()
      ? moment().add(1, 'day')
      : moment().subtract(1, 'day');
    let defaultDates = [date1, date2];
    set(this, 'disabledDates', defaultDates);
    await render(hbs`{{date-picker disabledDates=disabledDates}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert.dom(`button[data-test-date-picker-day="${defaultDates[0].year()}-${defaultDates[0].month()}-${defaultDates[0].date()}"]`).hasAttribute('disabled');
    assert.dom(`button[data-test-date-picker-day="${defaultDates[1].year()}-${defaultDates[1].month()}-${defaultDates[1].date()}"]`).hasAttribute('disabled');
  });

  test('getDatePicker works in the past', async function(assert) {
    assert.expect(3);

    let targetDate = moment().subtract(3, 'years');

    this.actions.updateDate = function(date) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(date.format('YYYY-MM-DD'), targetDate.format('YYYY-MM-DD'), 'correct date is passed to action.');
    };
    await render(hbs`{{date-picker action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(targetDate);

    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('getDatePicker works in the future', async function(assert) {
    assert.expect(3);

    let targetDate = moment().add(3, 'years');

    this.actions.updateDate = function(date) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(date.format('YYYY-MM-DD'), targetDate.format('YYYY-MM-DD'), 'correct date is passed to action.');
    };
    await render(hbs`{{date-picker action=(action 'updateDate')}}`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(targetDate);

    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('selectDate helper works in the past', async function(assert) {
    assert.expect(2);

    let targetDate = moment().subtract(3, 'years');

    this.actions.updateDate = function(date) {
      assert.equal(date.format('YYYY-MM-DD'), targetDate.format('YYYY-MM-DD'));
    };

    await render(hbs`{{date-picker action=(action 'updateDate')}}`);
    await selectDate('.date-picker__wrapper', targetDate);
    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('selectDate helper works in the present', async function(assert) {
    assert.expect(2);

    let targetDate = moment();

    this.actions.updateDate = function(date) {
      assert.equal(date.format('YYYY-MM-DD'), targetDate.format('YYYY-MM-DD'));
    };

    await render(hbs`{{date-picker action=(action 'updateDate')}}`);
    await selectDate('.date-picker__wrapper', targetDate);
    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('selectDate helper works in the future', async function(assert) {
    assert.expect(2);

    let targetDate = moment().add(3, 'years');

    this.actions.updateDate = function(date) {
      assert.equal(date.format('YYYY-MM-DD'), targetDate.format('YYYY-MM-DD'));
    };

    await render(hbs`{{date-picker action=(action 'updateDate')}}`);
    await selectDate('.date-picker__wrapper', targetDate);
    assert.dom('.date-picker').doesNotExist('date picker is closed after selection.');
  });

  test('getSelectedDate helper works', async function(assert) {
    this.date = moment().add(2, 'days').add(2, 'hours');

    await render(hbs`{{date-picker value=date}}`);

    let selectedDate = await getSelectedDate(this.element);
    assert.ok(selectedDate.isSame(this.date, 'day'));
  });

  test('getSelectedDate helper works without a value', async function(assert) {
    await render(hbs`{{date-picker}}`);

    let selectedDate = await getSelectedDate(this.element);
    assert.equal(selectedDate, null);
  });

  test('getSelectedDate helper works with a range', async function(assert) {
    this.dates = [
      moment().add(2, 'days').add(2, 'hours'),
      moment().add(5, 'days').add(2, 'hours')
    ];

    await render(hbs`{{date-picker value=dates range=true}}`);

    let selectedDates = await getSelectedDate(this.element);
    assert.ok(selectedDates[0].isSame(this.dates[0], 'day'), 'date from is correct');
    assert.ok(selectedDates[1].isSame(this.dates[1], 'day'), 'date to is correct');
  });

  test('getSelectedDate helper works with a range without values', async function(assert) {
    await render(hbs`{{date-picker range=true}}`);

    let selectedDates = await getSelectedDate(this.element);
    assert.deepEqual(selectedDates, [null, null]);
  });

});

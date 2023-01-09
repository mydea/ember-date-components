import { typeOf as getTypeOf } from '@ember/utils';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import {
  getDatePicker,
  selectDate,
  selectDateRange,
  getSelectedDate,
} from 'ember-date-components/test-support/helpers/date-picker';
import settled from '@ember/test-helpers/settled';

module('Integration | Component | date-picker', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    moment.locale('en');
  });

  test('it renders with no attribute set', async function (assert) {
    this.onChange = () => {};

    await render(hbs`<DatePicker @onChange={{this.onChange}} />`);

    assert.dom('[data-test-date-picker-toggle-button]').exists();
    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText('Select date...', 'Default placeholder is displayed in button.');
  });

  test('default value works', async function (assert) {
    let date = moment();

    this.date = date;
    this.onChange = () => {};

    await render(hbs`
      <DatePicker
        @value={{this.date}}
        @onChange={{this.onChange}}
      />`);

    assert.dom('[data-test-date-picker-toggle-button]').exists();
    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText(
        date.format('L'),
        'Formatted value of default date is displayed in button.'
      );
  });

  test('action is sent on value change', async function (assert) {
    this.onChange = function (date) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(
        date.format('YYYY-MM-DD'),
        moment().date(7).format('YYYY-MM-DD'),
        'correct date is passed to action.'
      );

      assert.step('onChange is called');
    };

    await render(hbs`
      <DatePicker
        @onChange={{this.onChange}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert
      .dom('.date-picker')
      .doesNotExist('date picker is closed after selection.');

    assert.verifySteps(['onChange is called']);
  });

  test('default value is not muted after change of date', async function (assert) {
    let date = moment();
    this.date = date;

    this.onChange = function (date) {
      assert.equal(
        date.format('YYYY-MM-DD'),
        moment().date(7).format('YYYY-MM-DD'),
        'correct date is passed to action.'
      );

      assert.step('onChange is called');
    };

    await render(hbs`
      <DatePicker
        @value={{this.date}}
        @onChange={{this.onChange}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert.equal(this.date, date, 'original default date is not changed.');

    assert.verifySteps(['onChange is called']);
  });

  test('value updates if bound value changes', async function (assert) {
    let date = moment();
    this.date = date;

    this.onChange = () => {};

    await render(hbs`
      <DatePicker
        @value={{this.date}}
        @onChange={{this.onChange}}
      />`);

    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText(
        date.format('L'),
        'Formatted value of default date is displayed in button.'
      );

    let newDate = moment().add(1, 'day');
    this.set('date', newDate);
    await settled();

    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText(newDate.format('L'), 'value in date picker is updated.');
  });

  test('date picker shows month of value if set', async function (assert) {
    let date = moment().add(2, 'months');
    this.date = date;

    this.onChange = () => {};

    await render(hbs`
      <DatePicker
        @value={{this.date}}
        @onChange={{this.onChange}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert
      .dom('[data-test-date-picker-month]')
      .hasAttribute('data-test-date-picker-month', `${date.format('MM')}`);
  });

  test('calendar displays week starting on Monday', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DatePicker
        @onChange={{this.onChange}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert
      .dom('.date-picker .date-picker__weekday:first-child')
      .hasText('Mo', 'first week day is Monday');
  });

  test('calendar displays week starting on Sunday', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <DatePicker
        @onChange={{this.onChange}}
        @startWeekOnSunday={{true}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert
      .dom('.date-picker .date-picker__weekday:first-child')
      .hasText('Su', 'first week day is Sunday');
  });

  test('it allows to change date multiple times', async function (assert) {
    this.date = undefined;

    this.onChange = (date) => {
      assert.step(`onChange is called with ${date.format('YYYY-MM-DD')}`);
      this.set('date', date);
    };

    await render(hbs`
      <DatePicker
        @value={{this.date}}
        @onChange={{this.onChange}}
      />`);

    let datePicker = getDatePicker('.date-picker__wrapper');

    await datePicker.selectDate(moment('2021-04-26'));
    await datePicker.selectDate(moment('2021-04-28'));
    await datePicker.selectDate(moment('2021-04-24'));

    assert
      .dom('[data-test-date-picker-toggle-button]')
      .hasText(
        moment('2021-04-24').format('L'),
        'value in date picker is updated.'
      );

    assert.verifySteps([
      'onChange is called with 2021-04-26',
      'onChange is called with 2021-04-28',
      'onChange is called with 2021-04-24',
    ]);
  });

  test('onClose works', async function (assert) {
    this.onChange = () => {
      assert.step('onChange is called');
    };

    this.onClose = function (date) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');

      assert.equal(
        date.format('YYYY-MM-DD'),
        moment().date(7).format('YYYY-MM-DD'),
        'correct date is passed'
      );

      assert.step('onClose is called');
    };

    await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
      @onClose={{this.onClose}}
    />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();
    await datePicker.selectDate(moment().date(7));

    assert.notOk(
      datePicker.isOpen(),
      'date picker is closed after to-selection.'
    );

    assert.verifySteps(['onChange is called', 'onClose is called']);
  });

  test('`renderInPlace` correctly rendered', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
      @renderInPlace={{true}}
    />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class'
      );
  });

  test('yielding a button works', async function (assert) {
    let date = moment();
    this.date = date;

    this.onChange = () => {};

    await render(hbs`
    <DatePicker
      @value={{this.date}}
      @onChange={{this.onChange}}
    >
      <button class='test1' type='button'>Button</button>
    </DatePicker>`);

    assert.dom('.test1').exists('Custom Button is displayed');

    // Check if correct date is selected
    await click('.test1');
    assert.dom('.date-picker__day--selected').exists();
    assert
      .dom('.date-picker__day--selected')
      .hasAttribute(
        'data-test-date-picker-day',
        `${date.year()}-${date.month()}-${date.date()}`
      );
  });

  test('the yielded content receives the array of selected dates as values', async function (assert) {
    let date = moment();
    this.date = date;

    this.onChange = () => {};

    await render(hbs`
    <DatePicker
      @value={{this.date}}
      @onChange={{this.onChange}}
    as |values|>
      {{#each values as |value|}}
        <div class='test-values'>{{if value (moment-format value 'YYYY-MM-DD')}}</div>
      {{/each}}
    </DatePicker>`);

    assert
      .dom('.test-values')
      .exists({ count: 1 }, 'one value is yielded for regular date pickers');
    assert
      .dom('.test-values')
      .hasText(date.format('YYYY-MM-DD'), 'correct date is yielded');
  });

  test('submitting disabled dates disables those dates on the date picker', async function (assert) {
    let date1 = moment();
    // We use tomorrow as the second day, except for the case where tomorrow is in the next month
    let date2 =
      moment().add(1, 'day').month() === date1.month()
        ? moment().add(1, 'day')
        : moment().subtract(1, 'day');

    let disabledDates = [date1, date2];
    this.disabledDates = disabledDates;

    this.onChange = () => {};

    await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
      @disabledDates={{this.disabledDates}}
    />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    assert
      .dom(
        `button[data-test-date-picker-day="${disabledDates[0].year()}-${disabledDates[0].month()}-${disabledDates[0].date()}"]`
      )
      .hasAttribute('disabled');
    assert
      .dom(
        `button[data-test-date-picker-day="${disabledDates[1].year()}-${disabledDates[1].month()}-${disabledDates[1].date()}"]`
      )
      .hasAttribute('disabled');
  });

  test('should disable dates with min&max attributes', async function (assert) {
    let min = moment().subtract(5, 'days').startOf('day');
    let max = moment().add(10, 'days').startOf('day');
    let today = moment().startOf('day').startOf('day');
    let daysInMonth = today.daysInMonth();

    this.minDate = min;
    this.maxDate = max;

    this.onChange = () => {};

    assert.expect(daysInMonth);

    await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
      @minDate={{this.minDate}}
      @maxDate={{this.maxDate}}
    />`);

    let datePicker = getDatePicker('.date-picker__wrapper');
    await datePicker.toggle();

    for (let i = 1; i <= daysInMonth; i++) {
      let iterationDay = today.clone().set('date', i).startOf('day');
      let daySelector = `${iterationDay.year()}-${iterationDay.month()}-${iterationDay.date()}`;
      if (iterationDay.isBefore(min) || iterationDay.isAfter(max)) {
        assert.dom(`[data-test-date-picker-day="${daySelector}"]`).isDisabled();
      } else {
        assert.dom(`[data-test-date-picker-day="${daySelector}"]`).isEnabled();
      }
    }
  });

  module('range', function () {
    test('onChange works', async function (assert) {
      let counter = 0;

      this.onChange = function (dates) {
        assert.equal(arguments.length, 1, 'one argument is passed to action.');
        assert.equal(getTypeOf(dates), 'array', 'array is passed');

        let [from, to] = dates;

        if (counter === 0) {
          assert.equal(
            from.format('YYYY-MM-DD'),
            moment().date(7).format('YYYY-MM-DD'),
            'correct date is passed as from-date.'
          );
          assert.equal(to, null, 'to-date is null');
        } else {
          assert.equal(
            from.format('YYYY-MM-DD'),
            moment().date(7).format('YYYY-MM-DD'),
            'correct date is passed as from-date.'
          );
          assert.equal(
            to.format('YYYY-MM-DD'),
            moment().date(14).format('YYYY-MM-DD'),
            'correct date is passed as to-date.'
          );
        }

        counter++;
        assert.step('onChange is called');
      };

      await render(hbs`
        <DatePicker
          @range={{true}}
          @onChange={{this.onChange}}
        />`);

      let datePicker = getDatePicker('.date-picker__wrapper');
      await datePicker.toggle();
      await datePicker.selectDate(moment().date(7));

      assert.ok(
        datePicker.isOpen(),
        'date picker is not closed after from-selection.'
      );

      await datePicker.selectDate(moment().date(14));

      assert.notOk(
        datePicker.isOpen(),
        'date picker is closed after to-selection.'
      );

      assert.verifySteps(['onChange is called', 'onChange is called']);
    });

    test('it allows selection of to-value without from-value', async function (assert) {
      this.onChange = function (dates) {
        assert.equal(arguments.length, 1, 'one argument is passed to action.');
        assert.equal(getTypeOf(dates), 'array', 'array is passed');

        let [from, to] = dates;
        assert.equal(from, null, 'from-date is null');
        assert.equal(
          to.format('YYYY-MM-DD'),
          moment().date(7).format('YYYY-MM-DD'),
          'correct date is passed as to-date.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
      <DatePicker
        @range={{true}}
        @onChange={{this.onChange}}
      />`);

      let datePicker = getDatePicker('.date-picker__wrapper');
      await datePicker.toggleTo();
      await datePicker.selectDate(moment().date(7));

      assert.verifySteps(['onChange is called']);
    });

    test('onClose works', async function (assert) {
      this.onChange = () => {
        assert.step('onChange is called');
      };

      this.onClose = function (dates) {
        assert.equal(arguments.length, 1, 'one argument is passed to action.');
        assert.equal(getTypeOf(dates), 'array', 'array is passed');

        let [from, to] = dates;
        assert.equal(
          from.format('YYYY-MM-DD'),
          moment().date(7).format('YYYY-MM-DD'),
          'correct date is passed as from-date.'
        );
        assert.equal(
          to.format('YYYY-MM-DD'),
          moment().date(14).format('YYYY-MM-DD'),
          'correct date is passed as to-date.'
        );

        assert.step('onClose is called');
      };

      await render(hbs`
      <DatePicker
        @range={{true}}
        @onChange={{this.onChange}}
        @onClose={{this.onClose}}
      />`);

      let datePicker = getDatePicker('.date-picker__wrapper');
      await datePicker.toggle();
      await datePicker.selectDate(moment().date(7));

      assert.ok(
        datePicker.isOpen(),
        'date picker is not closed after from-selection.'
      );

      await datePicker.selectDate(moment().date(14));

      assert.notOk(
        datePicker.isOpen(),
        'date picker is closed after to-selection.'
      );

      assert.verifySteps([
        'onChange is called',
        'onChange is called',
        'onClose is called',
      ]);
    });

    test('the yielded content receives the array of selected dates as values', async function (assert) {
      let date = moment();
      this.dates = [date, null];

      this.onChange = () => {};

      await render(hbs`
      <DatePicker
        @range={{true}}
        @value={{this.dates}}
        @onChange={{this.onChange}}
      as |values|>
        {{#each values as |value|}}
          <div class='test-values'>{{if value (moment-format value 'YYYY-MM-DD')}}</div>
        {{/each}}
      </DatePicker>`);

      assert
        .dom('.test-values')
        .exists({ count: 2 }, 'two values are yielded for date range pickers');
      assert
        .dom('.test-values:nth-child(1)')
        .hasText(date.format('YYYY-MM-DD'), 'correct date is yielded');
      assert
        .dom('.test-values:nth-child(2)')
        .hasText('', 'correct date is yielded');
    });
  });

  module('test helperts', function () {
    test('getDatePicker works in the past', async function (assert) {
      let targetDate = moment().subtract(3, 'years');

      this.onChange = function (date) {
        assert.equal(
          date.format('YYYY-MM-DD'),
          targetDate.format('YYYY-MM-DD'),
          'correct date is passed to action.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      let datePicker = getDatePicker('.date-picker__wrapper');
      await datePicker.toggle();
      await datePicker.selectDate(targetDate);

      assert
        .dom('.date-picker')
        .doesNotExist('date picker is closed after selection.');

      assert.verifySteps(['onChange is called']);
    });

    test('getDatePicker works in the future', async function (assert) {
      let targetDate = moment().add(3, 'years');

      this.onChange = function (date) {
        assert.equal(
          date.format('YYYY-MM-DD'),
          targetDate.format('YYYY-MM-DD'),
          'correct date is passed to action.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      let datePicker = getDatePicker('.date-picker__wrapper');
      await datePicker.toggle();
      await datePicker.selectDate(targetDate);

      assert
        .dom('.date-picker')
        .doesNotExist('date picker is closed after selection.');

      assert.verifySteps(['onChange is called']);
    });

    test('selectDate helper works in the past', async function (assert) {
      let targetDate = moment().subtract(3, 'years');

      this.onChange = function (date) {
        assert.equal(
          date.format('YYYY-MM-DD'),
          targetDate.format('YYYY-MM-DD'),
          'correct date is passed to action.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      await selectDate('.date-picker__wrapper', targetDate);
      assert
        .dom('.date-picker')
        .doesNotExist('date picker is closed after selection.');

      assert.verifySteps(['onChange is called']);
    });

    test('selectDate helper works in the present', async function (assert) {
      let targetDate = moment();

      this.onChange = function (date) {
        assert.equal(
          date.format('YYYY-MM-DD'),
          targetDate.format('YYYY-MM-DD'),
          'correct date is passed to action.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      await selectDate('.date-picker__wrapper', targetDate);
      assert
        .dom('.date-picker')
        .doesNotExist('date picker is closed after selection.');

      assert.verifySteps(['onChange is called']);
    });

    test('selectDate helper works in the future', async function (assert) {
      let targetDate = moment().add(3, 'years');

      this.onChange = function (date) {
        assert.equal(
          date.format('YYYY-MM-DD'),
          targetDate.format('YYYY-MM-DD'),
          'correct date is passed to action.'
        );

        assert.step('onChange is called');
      };

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      await selectDate('.date-picker__wrapper', targetDate);
      assert
        .dom('.date-picker')
        .doesNotExist('date picker is closed after selection.');

      assert.verifySteps(['onChange is called']);
    });

    test('getSelectedDate helper works', async function (assert) {
      this.date = moment().add(2, 'days').add(2, 'hours');

      this.onChange = () => {};

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
      @value={{this.date}}
    />`);

      let selectedDate = await getSelectedDate(this.element);
      assert.ok(selectedDate.isSame(this.date, 'day'));
    });

    test('getSelectedDate helper works without a value', async function (assert) {
      this.onChange = () => {};

      await render(hbs`
    <DatePicker
      @onChange={{this.onChange}}
    />`);

      let selectedDate = await getSelectedDate(this.element);
      assert.equal(selectedDate, null);
    });

    test('getSelectedDate helper works with a range', async function (assert) {
      this.dates = [
        moment().add(2, 'days').add(2, 'hours'),
        moment().add(5, 'days').add(2, 'hours'),
      ];

      this.onChange = () => {};

      await render(hbs`
    <DatePicker
      @range={{true}}
      @onChange={{this.onChange}}
      @value={{this.dates}}
    />`);

      let selectedDates = await getSelectedDate(this.element);
      assert.ok(
        selectedDates[0].isSame(this.dates[0], 'day'),
        'date from is correct'
      );
      assert.ok(
        selectedDates[1].isSame(this.dates[1], 'day'),
        'date to is correct'
      );
    });

    test('getSelectedDate helper works with a range without values', async function (assert) {
      this.onChange = () => {};

      await render(hbs`
    <DatePicker
      @range={{true}}
      @onChange={{this.onChange}}
    />`);

      let selectedDates = await getSelectedDate(this.element);
      assert.deepEqual(selectedDates, [null, null]);
    });

    test('selectDateRange test helper works', async function (assert) {
      let fromDate = moment('2018-01-05');
      let toDate = moment('2018-02-02');

      this.dateRange = null;

      this.onChange = (dateRange) => {
        this.set('dateRange', dateRange);
      };

      await render(hbs`
    <DatePicker
      @range={{true}}
      @onChange={{this.onChange}}
      @value={{this.dates}}
    />`);

      await selectDateRange(this.element, fromDate, toDate);

      assert.ok(
        fromDate.isSame(this.dateRange[0], 'day'),
        'from date is correct'
      );
      assert.ok(toDate.isSame(this.dateRange[1], 'day'), 'to date is correct');
    });
  });
});

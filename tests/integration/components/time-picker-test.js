import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import {
  selectTime,
  getSelectedTime,
} from 'ember-date-components/test-support/helpers/time-picker';
import { compareTimes } from 'dummy/tests/helpers/compare-times';

module('Integration | Component | time-picker', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    moment.locale('en');
  });

  test('it renders with no attribute set', async function (assert) {
    this.onChange = () => {};

    await render(hbs`<TimePicker @onChange={{this.onChange}} />`);

    assert.dom('button').exists('button is shown by default');
    assert
      .dom('.time-picker__dropdown')
      .doesNotExist('Dropdown is not shown by default');
    assert.equal(
      getSelectedTime(this.element),
      null,
      'no time is selected by default'
    );
    assert.dom('button').hasText('Enter time...');
  });

  test('value as moment instance works', async function (assert) {
    let time = moment();

    this.onChange = () => {};
    this.defaultTime = time;

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @amPm={{false}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert.dom('button').hasText(time.format('HH:mm'), 'Correct date is shown');
    assert.ok(
      compareTimes(getSelectedTime(this.element), time),
      'getSelectedTime returns correct moment instance'
    );
  });

  test('value as string works', async function (assert) {
    this.onChange = () => {};
    this.defaultTime = '08:30';

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @amPm={{false}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert.dom('button').hasText('08:30', 'Correct date is shown');
    assert.ok(
      compareTimes(
        getSelectedTime(this.element),
        moment().set('hour', 8).set('minute', 30).startOf('minute')
      ),
      'getSelectedTime returns correct moment instance'
    );
  });

  test('amPm setting works', async function (assert) {
    let time = moment();

    this.onChange = () => {};
    this.defaultTime = time;

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @amPm={{true}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert
      .dom('button')
      .hasText(time.format('hh:mm a'), 'Correct date is shown');
  });

  test('action is sent on value change', async function (assert) {
    assert.expect(3);

    this.onChange = function (time) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(
        time.format('HH:mm'),
        '14:30',
        'correct time is passed to action.'
      );
    };

    await render(hbs`
      <TimePicker 
        @onChange={{this.onChange}} 
      />
    `);

    await selectTime(this.element, '14:30');
    assert
      .dom('.time-picker__dropdown')
      .doesNotExist('time picker dropdown is closed after selection.');
  });

  test('default value is not mutated after change of time', async function (assert) {
    assert.expect(2);

    let time = moment(0).hours(4).minutes(30);
    this.defaultTime = time;

    this.onChange = (newTime) => {
      assert.equal(
        newTime.format('HH:mm'),
        '05:30',
        'correct time is passed to action.'
      );
      assert.equal(
        this.defaultTime,
        time,
        'original default time is not changed.'
      );
    };

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @onChange={{this.onChange}} 
      />
    `);

    await selectTime(this.element, '05:30');
  });

  test('amPm is correctly evaluated for locale en', async function (assert) {
    moment.locale('en');
    let time = moment();

    this.defaultTime = time;
    this.onChange = () => {};

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert
      .dom('button')
      .hasText(time.format('hh:mm a'), 'Correct date is shown');
  });

  test('amPm is correctly evaluated for locale de', async function (assert) {
    moment.locale('de');
    let time = moment();

    this.defaultTime = time;
    this.onChange = () => {};

    await render(hbs`
      <TimePicker 
        @value={{this.defaultTime}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert.dom('button').hasText(time.format('HH:mm'), 'Correct date is shown');
  });

  test('`renderInPlace` correctly rendered', async function (assert) {
    this.onChange = () => {};

    await render(hbs`
      <TimePicker 
        @renderInPlace={{true}} 
        @onChange={{this.onChange}} 
      />
    `);

    assert
      .dom('.ember-basic-dropdown-trigger')
      .hasClass(
        'ember-basic-dropdown-trigger--in-place',
        'The trigger has a special `--in-place` class'
      );
  });
});

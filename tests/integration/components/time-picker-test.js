import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { setTimePickerValue } from 'ember-date-components/test-support/helpers/date-picker';
import { get, set } from '@ember/object';

module('Integration | Component | time picker', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    moment.locale('en');
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('it renders with no attribute set', async function(assert) {
    await render(hbs`{{time-picker}}`);

    assert.dom('input').exists('input is shown by default');
    assert.dom('.time-picker__dropdown').doesNotExist('Dropdown is not shown by default');
  });

  test('default value works', async function(assert) {
    let time = moment();
    set(this, 'defaultTime', time);
    await render(hbs`{{time-picker value=defaultTime amPm=false}}`);

    assert.dom('input').hasValue(time.format('HH:mm'), 'Correct date is shown');
  });

  test('amPm setting works', async function(assert) {
    let time = moment();
    set(this, 'defaultTime', time);
    await render(hbs`{{time-picker value=defaultTime amPm=true}}`);

    assert.dom('input').hasValue(time.format('hh:mm a'), 'Correct date is shown');
  });

  test('action is sent on value change', async function(assert) {
    assert.expect(3);

    this.actions.uptimeTime = function(time) {
      assert.equal(arguments.length, 1, 'one argument is passed to action.');
      assert.equal(time.format('HH:mm'), '14:30', 'correct time is passed to action.');
    };
    await render(hbs`{{time-picker action=(action 'uptimeTime')}}`);

    await setTimePickerValue(this.element, '14:30');
    assert.dom('.time-picker__dropdown').doesNotExist('time picker dropdown is closed after selection.');
  });

  test('default value is not muted after change of time', async function(assert) {
    assert.expect(2);

    let time = moment(0).hours(4).minutes(30);
    set(this, 'defaultTime', time);
    this.actions.uptimeTime = (newTime) => {
      assert.equal(newTime.format('HH:mm'), '05:30', 'correct time is passed to action.');
      assert.equal(get(this, 'defaultTime'), time, 'original default time is not changed.');
    };
    await render(hbs`{{time-picker value=defaultTime action=(action 'uptimeTime')}}`);

    await setTimePickerValue(this.element, '05:30');
  });

  test('amPm is correctly evaluated for locale en', async function(assert) {
    moment.locale('en');
    let time = moment();
    set(this, 'defaultTime', time);
    await render(hbs`{{time-picker value=defaultTime}}`);

    assert.dom('input').hasValue(time.format('hh:mm a'), 'Correct date is shown');
  });

  test('amPm is correctly evaluated for locale de', async function(assert) {
    moment.locale('de');
    let time = moment();
    set(this, 'defaultTime', time);
    await render(hbs`{{time-picker value=defaultTime}}`);

    assert.dom('input').hasValue(time.format('HH:mm'), 'Correct date is shown');
  });

  test('`renderPlace` correctly rendered', async function(assert) {
    set(this, 'renderInPlace', true);
    await render(hbs`{{time-picker renderInPlace=renderInPlace}}`);

    assert.dom('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--in-place', 'The trigger has a special `--in-place` class');
  });
});

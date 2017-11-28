import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
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

moduleForComponent('time-picker', 'Integration | Component | time picker', {
  integration: true
});

test('it renders with no attribute set', function(assert) {
  this.render(hbs`{{time-picker}}`);

  assert.ok(this.$().find('input').length, 'input is shown by default');
  assert.notOk(this.$().find('.time-picker__dropdown').hasClass('time-picker__dropdown--open'), 'Dropdown is not shown by default');
});

test('default value works', function(assert) {
  let time = moment();
  this.set('defaultTime', time);
  this.render(hbs`{{time-picker value=defaultTime amPm=false}}`);

  assert.equal(this.$().find('input').val().trim(), time.format('HH:mm'), 'Correct date is shown');
});

test('amPm setting works', function(assert) {
  let time = moment();
  this.set('defaultTime', time);
  this.render(hbs`{{time-picker value=defaultTime amPm=true}}`);

  assert.equal(this.$().find('input').val().trim(), time.format('hh:mm a'), 'Correct date is shown');
});

test('action is sent on value change', function(assert) {
  assert.expect(3);

  this.on('uptimeTime', function(time) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(time.format('HH:mm'), '14:30', 'correct time is passed to action.');
  });
  this.render(hbs`{{time-picker action=(action 'uptimeTime')}}`);

  setTimePickerValue(this.$(), '14:30');

  run.next(() => {
    assert.notOk(this.$().find('.time-picker__dropdown').hasClass('time-picker__dropdown--open'), 'time picker dropdown is closed after selection.');
  });
});

test('default value is not muted after change of time', function(assert) {
  assert.expect(2);

  let time = moment(0).hours(4).minutes(30);
  this.set('defaultTime', time);
  this.on('uptimeTime', (newTime) => {
    assert.equal(newTime.format('HH:mm'), '05:30', 'correct time is passed to action.');
    assert.equal(this.get('defaultTime'), time, 'original default time is not changed.');
  });
  this.render(hbs`{{time-picker value=defaultTime action=(action 'uptimeTime')}}`);

  setTimePickerValue(this.$(), '05:30');
});

test('amPm is correctly evaluated for locale en', function(assert) {
  moment.locale('en');
  let time = moment();
  this.set('defaultTime', time);
  this.render(hbs`{{time-picker value=defaultTime}}`);

  assert.equal(this.$().find('input').val().trim(), time.format('hh:mm a'), 'Correct date is shown');
});

test('amPm is correctly evaluated for locale de', function(assert) {
  moment.locale('de');
  let time = moment();
  this.set('defaultTime', time);
  this.render(hbs`{{time-picker value=defaultTime}}`);

  assert.equal(this.$().find('input').val().trim(), time.format('HH:mm'), 'Correct date is shown');
});

test('`renderPlace` correctly rendered', function(assert) {
  this.set('renderInPlace', true);
  this.render(hbs`{{time-picker renderInPlace=renderInPlace}}`);

  run.next(() => {
    assert.ok(this.$().find('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--in-place'), 'The trigger has a special `--in-place` class');
  });
});

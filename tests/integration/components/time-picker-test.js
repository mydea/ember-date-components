import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import Ember from 'ember';
import $ from 'jquery';
import wait from 'ember-test-helpers/wait';

const {
  run
} = Ember;

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

  let $input = this.$().find('input');
  $input.val('14:30').trigger('keyup');
  let enterEvent = $.Event('keyup');
  enterEvent.which = 13;
  enterEvent.keyCode = 13;
  $input.trigger(enterEvent);

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

  let $input = this.$().find('input');
  $input.val('05:30').trigger('keyup');
  let enterEvent = $.Event('keyup');
  enterEvent.which = 13;
  enterEvent.keyCode = 13;
  $input.trigger(enterEvent);
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

test('action is sent when the user removes focus from input field', function(assert) {
  assert.expect(3);

  this.on('uptimeTime', function(time) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(time.format('HH:mm'), '14:30', 'correct time is passed to action.');
  });
  this.render(hbs`{{time-picker action=(action 'uptimeTime')}}`);

  let $input = this.$().find('input');
  $input.val('14:30').trigger('keyup').trigger('focus');
  $input.trigger('focusout');

  return wait().then(() => {
    assert.notOk(this.$().find('.time-picker__dropdown').hasClass('time-picker__dropdown--open'), 'time picker dropdown is closed after selection.');
  });
});

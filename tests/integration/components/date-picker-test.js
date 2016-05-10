import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import Ember from 'ember';

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true
});

test('it renders with no attribute set', function(assert) {
  this.render(hbs`{{date-picker}}`);

  assert.ok(this.$().find('[data-test="datepicker-toggle-button"]').length, 'Button is displayed by default');
  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), 'Select Date...', 'Default placeholder is displayed in button.');
});

test('default value works', function(assert) {
  let date = moment();
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.ok(this.$().find('[data-test="datepicker-toggle-button"]').length, 'Button is displayed');
  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
});

test('action is sent on value change', function(assert) {
  assert.expect(3);

  this.on('updateDate', function(date) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(date.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed to action.');
  });
  this.render(hbs`{{date-picker action=(action 'updateDate')}}`);

  this.$().find('[data-test="datepicker-toggle-button"]').click();
  this.$().find(`button[data-test="day-${moment().month()}-7"]`).click();

  Ember.run.next(() => {
    assert.notOk(this.$().find('.date-picker').hasClass('date-picker--open'), 'date picker is closed after selection.');
  });
});

test('default value is not muted after change of date', function(assert) {
  assert.expect(2);

  let date = moment();
  this.set('defaultDate', date);
  this.on('updateDate', (newDate) => {
    assert.equal(newDate.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed to action.');
    assert.equal(this.get('defaultDate'), date, 'original default date is not changed.');
  });
  this.render(hbs`{{date-picker value=defaultDate action=(action 'updateDate')}}`);

  this.$().find('[data-test="datepicker-toggle-button"]').click();
  this.$().find(`button[data-test="day-${moment().month()}-7"]`).click();
});

test('value updates if bound value changes', function(assert) {
  let date = moment();
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
  Ember.run(() => {
    date = moment().add(1, 'day');
    this.set('defaultDate', date);
  });
  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), date.format('L'), 'value in date picker is updated.');
});

test('date picker shows month of value if set', function(assert) {
  let date = moment().add(2, 'months');
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
  Ember.run(() => {
    date = moment().add(1, 'day');
    this.set('defaultDate', date);
  });
  assert.equal(this.$().find('[data-test="datepicker-toggle-button"]').text().trim(), date.format('L'), 'value in date picker is updated.');
});

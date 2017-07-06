import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import Ember from 'ember';
import interactWithDatePicker from 'ember-date-components/helpers/interact-with-date-picker';

const {
  run,
  typeOf: getTypeOf
} = Ember;

moduleForComponent('date-picker', 'Integration | Component | date picker', {
  integration: true
});

test('it renders with no attribute set', function(assert) {
  this.render(hbs`{{date-picker}}`);

  assert.ok(this.$().find('[data-test="date-picker-toggle-button"]').length, 'Button is displayed by default');
  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), 'Select Date...', 'Default placeholder is displayed in button.');
});

test('default value works', function(assert) {
  let date = moment();
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.ok(this.$().find('[data-test="date-picker-toggle-button"]').length, 'Button is displayed');
  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
});

test('action is sent on value change', function(assert) {
  assert.expect(3);

  this.on('updateDate', function(date) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(date.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed to action.');
  });
  this.render(hbs`{{date-picker action=(action 'updateDate')}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();
  datePicker.select(moment().date(7));

  run.next(() => {
    assert.notOk(this.$().find('.date-picker').length, 'date picker is closed after selection.');
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

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();
  datePicker.select(moment().date(7));
});

test('value updates if bound value changes', function(assert) {
  let date = moment();
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
  run(() => {
    date = moment().add(1, 'day');
    this.set('defaultDate', date);
  });
  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), date.format('L'), 'value in date picker is updated.');
});

test('date picker shows month of value if set', function(assert) {
  let date = moment().add(2, 'months');
  this.set('defaultDate', date);
  this.render(hbs`{{date-picker value=defaultDate}}`);

  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), date.format('L'), 'Formatted value of default date is displayed in button.');
  run(() => {
    date = moment().add(1, 'day');
    this.set('defaultDate', date);
  });
  assert.equal(this.$().find('[data-test="date-picker-toggle-button"]').text().trim(), date.format('L'), 'value in date picker is updated.');
});

test('calendar displays week starting on Monday', function(assert) {
  this.render(hbs`{{date-picker}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();

  assert.equal($('.date-picker .date-picker__weekday:first-child').text().trim(), 'Mo', 'first week day is Monday');
});

test('calendar displays week starting on Sunday', function(assert) {
  this.render(hbs`{{date-picker startWeekOnSunday=true}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();

  assert.equal($('.date-picker .date-picker__weekday:first-child').text().trim(), 'Su', 'first week day is Sunday');
});

test('date-range picker action works', function(assert) {
  assert.expect(10);

  let counter = 0;
  this.on('updateDate', function(dates) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(getTypeOf(dates), 'array', 'array is passed');

    let [from, to] = dates;

    if (counter === 0) {
      assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
      assert.equal(to, null, 'to-date is null');
    } else {
      assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
      assert.equal(to.format('YYYY-MM-DD'), moment().date(14).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

      run.next(() => {
        assert.notOk(datePicker.isOpen(), 'date picker is closed after to-selection.');
      });
    }
    counter++;
  });
  this.render(hbs`{{date-picker range=true action=(action 'updateDate')}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();
  datePicker.select(moment().date(7));

  run.next(() => {
    assert.ok(datePicker.isOpen(), 'date picker is not closed after from-selection.');

    datePicker.select(moment().date(14));
  });
});

test('date-range allows selection of to-value without from-value', function(assert) {
  assert.expect(4);

  this.on('updateDate', function(dates) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(getTypeOf(dates), 'array', 'array is passed');

    let [from, to] = dates;
    assert.equal(from, null, 'from-date is null');
    assert.equal(to.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

  });
  this.render(hbs`{{date-picker range=true action=(action 'updateDate')}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggleTo();
  datePicker.select(moment().date(7));
});

test('date-range picker closeAction works', function(assert) {
  assert.expect(6);

  this.on('updateDate', function(dates) {
    assert.equal(arguments.length, 1, 'one argument is passed to action.');
    assert.equal(getTypeOf(dates), 'array', 'array is passed');

    let [from, to] = dates;
    assert.equal(from.format('YYYY-MM-DD'), moment().date(7).format('YYYY-MM-DD'), 'correct date is passed as from-date.');
    assert.equal(to.format('YYYY-MM-DD'), moment().date(14).format('YYYY-MM-DD'), 'correct date is passed as to-date.');

    run.next(() => {
      assert.notOk(datePicker.isOpen(), 'date picker is closed after to-selection.');
    });
  });
  this.render(hbs`{{date-picker range=true closeAction=(action 'updateDate')}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();
  datePicker.select(moment().date(7));

  run.next(() => {
    assert.ok(datePicker.isOpen(), 'date picker is not closed after from-selection.');

    datePicker.select(moment().date(14));
  });
});

test('`renderPlace` correctly rendered', function(assert) {
  this.set('renderInPlace', true);
  this.render(hbs`{{date-picker renderInPlace=renderInPlace}}`);

  let datePicker = interactWithDatePicker(this.$().find('.date-picker__wrapper'));
  datePicker.toggle();

  run.next(() => {
    assert.ok(this.$().find('.ember-basic-dropdown-trigger').hasClass('ember-basic-dropdown-trigger--in-place'), 'The trigger has a special `--in-place` class');
  });
});

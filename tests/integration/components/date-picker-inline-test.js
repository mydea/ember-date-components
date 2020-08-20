import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { selectDate } from 'ember-date-components/test-support/helpers/date-picker';
import moment from 'moment';

module('Integration | Component | date-picker-inline', function (hooks) {
  setupRenderingTest(hooks);

  test('it works', async function (assert) {
    let targetDate = moment('2018-01-10');

    this.update = function (newDate) {
      assert.ok(
        targetDate.isSame(newDate, 'day'),
        'action is called with correct date'
      );
    };

    await render(hbs`{{date-picker-inline action=(action update)}}`);

    await selectDate(this.element, targetDate);
  });
});

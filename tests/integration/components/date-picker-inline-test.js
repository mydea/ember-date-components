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

    this.onChange = function (newDate) {
      assert.ok(
        targetDate.isSame(newDate, 'day'),
        'action is called with correct date'
      );

      assert.step('onChange is called');
    };

    await render(hbs`<DatePickerInline @onChange={{this.onChange}} />}`);

    await selectDate(this.element, targetDate);

    assert.verifySteps(['onChange is called']);
  });
});

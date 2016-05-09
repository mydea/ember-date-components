import Ember from 'ember';
import layout from '../templates/components/date-range-picker';

const {
  get,
  set,
  getProperties
} = Ember;

export default Ember.Component.extend({
  layout,

  // ATTRIBUTES BEGIN ----------------------------------------

  /**
   * The default min. date.
   *
   * @attribute dateFrom
   * @type {Date}
   * @default null
   * @public
   */
  dateFrom: null,

  /**
   * The default max. date.
   *
   * @attribute dateTo
   * @type {Date}
   * @default null
   * @public
   */
  dateTo: null,

  /**
   * The placeholder for the from step.
   *
   * @attribute placeholderFrom
   * @type {String}
   * @default 'Select From...'
   * @public
   */
  placeholderFrom: 'Select From...',

  /**
   * The placeholder for the to step.
   *
   * @attribute placeholderTo
   * @type {String}
   * @default 'Select To...'
   * @public
   */
  placeholderTo: 'Select To...',

  /**
   * The action to call whenever one of the value changes.
   *
   * @event action
   * @param {Date} dateFrom The selected from date (or null if empty)
   * @param {Date} dateTo The selected to date (or null if empty)
   * @public
   */
  action: null,

  // ATTRIBUTES END ----------------------------------------

  // PROPERTIES BEGIN ----------------------------------------

  /**
   * If the current step is the to-step.
   * This is used for moving between the steps.
   *
   * @property isToStep
   * @type {Boolean}
   * @default false
   * @private
   */
  isToStep: false,

  // PROPERTIES END ----------------------------------------

  // METHODS BEGIN ----------------------------------------

  /**
   * Actually send the action.
   *
   * @method _sendAction
   * @private
   */
  _sendAction() {
    let action = get(this, 'attrs.action');
    let {
      dateFrom,
      dateTo
    } = getProperties(this, 'dateFrom', 'dateTo');

    if (action) {
      action(dateFrom || null, dateTo || null);
    }
  },

  // METHODS END ----------------------------------------

  // ACTIONS BEGIN ----------------------------------------

  actions: {
    updateDateFrom(date) {
      set(this, 'dateFrom', date);
      set(this, 'isToStep', true);
    },

    updateDateTo(date) {
      set(this, 'dateTo', date);
      set(this, 'isToStep', false);
      this._sendAction();
    }
  }

  // ACTIONSD END ----------------------------------------
});

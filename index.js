'use strict';

module.exports = {
  name: 'ember-date-components',

  included(app) {
    this._super.included(app);

    let options = app.options['ember-date-components'] || {};
    let includeCSS = typeof options.includeCSS !== 'undefined' ? options.includeCSS : true;

    if (includeCSS) {
      app.import('vendor/ember-date-components.css');
    }
  },

  contentFor(type, config) {
    let emberBasicDropdown = this.addons.find((a) => a.name === 'ember-basic-dropdown');
    return emberBasicDropdown.contentFor(type, config);
  }
};

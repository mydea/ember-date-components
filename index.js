/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-date-components',

  included: function(app) {
    this._super.included(app);

    var options = app.options['ember-date-components'] || {};
    var includeCSS = typeof options.includeCSS !== 'undefined' ? options.includeCSS : true;

    if (includeCSS) {
      app.import('vendor/ember-date-components.css');
    }
  }
};

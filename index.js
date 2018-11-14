'use strict';

const path = require('path');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    // Get the host app, even in nested addons/engines
    let target = this._findHost();

    let options = target.options['ember-date-components'] || {};
    let includeCSS =
      typeof options.includeCSS !== 'undefined' ? options.includeCSS : true;

    if (includeCSS) {
      target.import('vendor/ember-date-components.css');
    }

    // If the host app has ember-cli-sass installed, add the app folder to the sass include paths
    let hasEmberCliSass = !!target.project.addons.find(
      (a) => a.name === 'ember-cli-sass'
    );
    if (hasEmberCliSass) {
      target.options.sassOptions = target.options.sassOptions || {};
      target.options.sassOptions.includePaths =
        target.options.sassOptions.includePaths || [];

      target.options.sassOptions.includePaths.push(
        path.join(__dirname, 'app', 'styles')
      );
    }
  },

  contentFor(type, config) {
    let emberBasicDropdown = this.addons.find(
      (a) => a.name === 'ember-basic-dropdown'
    );
    return emberBasicDropdown.contentFor(type, config);
  }
};

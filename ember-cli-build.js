'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: {},
    'ember-bootstrap': {
      'importBootstrapTheme': true,
      'bootstrapVersion': 3,
      'importBootstrapFont': true,
      'importBootstrapCSS': false,
      'whitelist': ['bs-dropdown']
    },
    'ember-prism': {
      'theme': 'twilight',
      'components': ['bash', 'handlebars', 'javascript', 'scss'],
      'plugins': ['line-highlight']
    },
    'ember-date-components': {
      includeCSS: true
    }
  });

  return app.toTree();
};

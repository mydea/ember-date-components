'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: {},
    'ember-bootstrap': {
      'importBootstrapTheme': true
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

  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  return app.toTree();
};

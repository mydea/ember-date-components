/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    'ember-bootstrap': {
      'importBootstrapTheme': true
    },
    'ember-prism': {
      'theme': 'twilight',
      'components': ['bash', 'handlebars', 'javascript'],
      'plugins': ['line-highlight']
    }
  });

  return app.toTree();
};

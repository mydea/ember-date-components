'use strict';
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: {},
    'ember-bootstrap': {
      importBootstrapTheme: true,
      bootstrapVersion: 4,
      importBootstrapCSS: false,
      whitelist: ['bs-nav', 'bs-navbar', 'bs-dropdown', 'bs-collapse'],
    },
    'ember-prism': {
      theme: 'twilight',
      components: [
        'bash',
        'handlebars',
        'javascript',
        'scss',
        'markup-templating',
      ],
      plugins: ['line-highlight'],
    },
    'ember-date-components': {
      includeCSS: true,
    },
    hinting: false,
  });

  return app.toTree();
};

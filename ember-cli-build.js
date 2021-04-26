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

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};

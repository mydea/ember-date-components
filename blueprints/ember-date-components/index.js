'use strict';

const path = require('path');
const fs = require('fs');

module.exports = {
  normalizeEntityName() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall() {
    let dependencies = this.project.dependencies();

    this.addAddonToProject('ember-moment');

    let type;
    let importStatement = "\n@import 'ember-basic-dropdown';\n";

    if ('ember-cli-sass' in dependencies) {
      type = 'scss';
    }

    if (type) {
      let stylePath = path.join('app', 'styles');
      let file = path.join(stylePath, `app.${type}`);

      if (!fs.existsSync(stylePath)) {
        fs.mkdirSync(stylePath);
      }
      if (fs.existsSync(file)) {
        this.ui.writeLine(`Added import statement to ${file}`);
        return this.insertIntoFile(file, importStatement, {});
      } else {
        fs.writeFileSync(file, importStatement);
        this.ui.writeLine(`Created ${file}`);
      }
    }
  },
};

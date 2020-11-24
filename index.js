/* eslint-env node */
'use strict';
const BasePlugin = require('ember-cli-deploy-plugin');
const fbTools = require('firebase-tools');

module.exports = {
  name: 'ember-cli-deploy-firebase',

  createDeployPlugin: function (options) {
    const DeployPlugin = BasePlugin.extend({
      name: options.name,

      upload: function (context) {
        const _self = this;
        const project = context.config.firebase.appName || context.config.fireBaseAppName;
        const options = {
          project: project,
          public: context.config.build.outputPath,
          message: (context.revisionData || {}).revisionKey,
          verbose: context.ui.verbose,
          force: true
        };
        if (context.config.firebase.deployToken || process.env.FIREBASE_TOKEN) {
          options.token = context.config.firebase.deployToken || process.env.FIREBASE_TOKEN;
        }
        return fbTools.deploy(options).then(function () {
          _self.log('successful deploy!', { verbose: true });
        }).catch(function (err) {
          // handle error
          _self.log('something bad happened oh no', { color: 'red' });
          _self.log(err, { color: 'red' });
          _self.log(err.stack, { color: 'red' });
        });
      }
    });

    return new DeployPlugin();
  }
};

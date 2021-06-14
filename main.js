const core = require('@actions/core');
const exec = require('@actions/exec');
const yaml = require('js-yaml');
const fs   = require('fs');

require('action-doctl');

Promise.retry = function(fn, times, delay) {
    return new Promise(function(resolve, reject){
        var error;
        var attempt = function() {
            if (times == 0) {
                reject(error);
            } else {
                fn().then(resolve)
                    .catch(function(e){
                        times--;
                        error = e;
                        setTimeout(function(){attempt()}, delay);
                    });
            }
        };
        attempt();
    });
};

async function checkOutput(command, args) {
  let output = '';

  const options = {};
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    }
  };
  options.silent = true;
  await exec.exec(command, args, options);
  return output;
}


async function run() {
  try {
    const specPath = core.getInput('spec', { required: true });
    var applicationId = core.getInput('app-id');
    // Hack: wait for doctl to get set up
    await Promise.retry(() => exec.exec('doctl', ['apps', 'list'], {'silent': true}), 30, 1000);
    if (!applicationId) {
      core.info(">>> 'application-id' not set, trying to determine application-id from spec name");
      const deploySpec = yaml.load(fs.readFileSync(specPath, 'utf8'));
      const deploySpecName = deploySpec['name']
      core.debug("Deploy name: ", deploySpec['name']);
      const appListStr = await checkOutput('doctl app list --no-header -o json');
      const appList = JSON.parse(appListStr);
      var existingApp = appList.find(app => app.spec.name == deploySpecName);
      if (!existingApp) {
        core.info(`>>> No existing app found with name '${deploySpecName}'; creating a new app.`)
        const createdAppsStr = await checkOutput('doctl app create --spec ./test/test-app.yaml -o json');
        const createdApps = JSON.parse(createdAppsStr);
        existingApp = createdApps.find(app => app.spec.name == deploySpecName);
        core.info(`>>> Successfully created new app with id ${existingApp.id}.`)
      } else {
        core.info(`>>> Found existing app with name '${deploySpecName}' and id '${existingApp.id}'`)
      }
      applicationId = existingApp.id
    }
    core.setOutput("app-id", applicationId);
    await exec.exec('doctl', ['app', 'update', applicationId, '--spec', specPath]);
    await exec.exec('doctl', ['app', 'create-deployment', applicationId, '--wait']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

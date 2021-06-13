const core = require('@actions/core');
const exec = require('@actions/exec');
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

async function run() {
  try {
    // Hack: wait for doctl to get set up
    await Promise.retry(() => exec.exec('doctl', ['apps', 'list'], {'silent': true}), 30, 1000);
    var applicationId = core.getInput('application-id');
    var specPath = core.getInput('spec');
    await exec.exec('doctl', ['apps', 'update', applicationId, '--spec', specPath]);
    await exec.exec('doctl', ['apps', 'create-deployment', applicationId, '--wait']);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

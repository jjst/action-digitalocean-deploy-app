const core = require('@actions/core');
const exec = require('@actions/exec');


async function run() {
  try {
    require('action-doctl');
    var applicationId = core.getInput('application-id');
    var specPath = core.getInput('spec');
    await exec.exec('doctl apps update', [applicationId, '--spec', specPath]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

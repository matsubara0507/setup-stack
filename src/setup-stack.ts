import * as core from '@actions/core';
import {installHaskellStack} from './installer';

async function run() {
  let version = core.getInput('stack-version');
  if (!version) {
    version = 'latest';
  }

  try {
    installHaskellStack(version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

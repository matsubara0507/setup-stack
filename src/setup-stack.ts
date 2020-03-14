import * as core from '@actions/core';
import {installHaskellStack} from './installer';

async function run() {
  try {
    installHaskellStack();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

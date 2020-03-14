import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';

export async function installHaskellStack(version: string) {
  const baseUrl = 'https://get.haskellstack.org/stable';
  let installDir = path.join(process.env.HOME, '.local', 'bin');

  switch (process.platform) {
    case 'linux':
      await _install(installDir, `${baseUrl}/linux-x86_64.tar.gz`);
      break;
    case 'darwin':
      await _install(installDir, `${baseUrl}/osx-x86_64.tar.gz`);
      break;
    case 'win32':
      installDir = path.join(process.env.APPDATA, 'local', 'bin');
      await _install(installDir, `${baseUrl}/windows-x86_64.zip`, true);
      break;
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }

  await _upgrade(version);
}

async function _install(
  installDir: string,
  installUrl: string,
  isZip?: boolean
) {
  const tmpPath = await tc.downloadTool(installUrl);
  const extractedDir = await (isZip
    ? tc.extractZip(tmpPath, installDir)
    : tc.extractTar(tmpPath, installDir));
  core.addPath(extractedDir);
  await io.rmRF(tmpPath);
}

async function _upgrade(version: string) {
  if (version != 'latest') {
    await exec.exec('stack', ['upgrade', '--binary-version', version], {
      failOnStdErr: true
    });
  }
}

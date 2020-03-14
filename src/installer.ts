import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as path from 'path';

export function installHaskellStack() {
  const baseUrl = 'https://get.haskellstack.org/stable';
  var installDir = path.join(process.env.HOME, '.local', 'bin');

  switch (process.platform) {
    case 'linux':
      _installHaskellStack(installDir, `${baseUrl}/linux-x86_64.tar.gz`);
      break;
    case 'darwin':
      _installHaskellStack(installDir, `${baseUrl}/osx-x86_64.tar.gz`);
      break;
    case 'win32':
      installDir = path.join(process.env.APPDATA, 'local', 'bin');
      _installHaskellStack(installDir, `${baseUrl}/windows-x86_64.zip`, true);
      break;
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }
}

async function _installHaskellStack(
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

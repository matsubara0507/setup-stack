import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';

export async function installHaskellStack(version: string) {
  const baseUrl = 'https://get.haskellstack.org/stable';

  let installDir;
  switch (process.platform) {
    case 'linux':
      installDir = path.join(process.env.HOME, '.local', 'bin');
      await _install(installDir, `${baseUrl}/linux-x86_64.tar.gz`);
      await _upgrade(version, true);
      break;
    case 'darwin':
      installDir = path.join(process.env.HOME, '.local', 'bin');
      await _install(installDir, `${baseUrl}/osx-x86_64.tar.gz`);
      await _upgrade(version, true);
      break;
    case 'win32':
      installDir = path.join(process.env.APPDATA, 'local', 'bin');
      await _install(installDir, `${baseUrl}/windows-x86_64.zip`, true);
      await _upgrade(version);
      break;
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }
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
  core.debug(`add path: ${extractedDir}`);
  await io.rmRF(tmpPath);
}

async function _upgrade(version: string, sudo?: boolean) {
  if (version != 'latest') {
    core.debug(`upgrade stack to ${version}`);
    if (sudo) {
      await exec.exec('sudo', [
        'stack',
        'upgrade',
        '--binary-version',
        version
      ]);
    } else {
      await exec.exec('stack', ['upgrade', '--binary-version', version]);
    }
  }
}

import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';
import * as fs from 'fs';

export async function installHaskellStack(version: string) {
  let installDir;
  switch (process.platform) {
    case 'linux':
      installDir = path.join(process.env.HOME, '.local', 'bin');
      await _install(installDir, version, 'linux-x86_64', 'tar.gz');
      break;
    case 'darwin':
      installDir = path.join(process.env.HOME, '.local', 'bin');
      await _install(installDir, version, 'osx-x86_64', 'tar.gz');
      break;
    case 'win32':
      installDir = path.join(process.env.APPDATA, 'local', 'bin');
      await _install(installDir, version, 'windows-x86_64', 'zip');
      break;
    default:
      throw new Error(`unsupported OS: ${process.platform}`);
  }
}

async function _install(
  installDir: string,
  version: string,
  platform: string,
  extension: 'tar.gz' | 'zip'
) {
  const archiveLink = _buildArchiveLink(version, `${platform}.${extension}`);
  const tmpPath = await tc.downloadTool(archiveLink);
  switch (extension) {
    case 'tar.gz':
      await tc.extractTar(tmpPath, installDir + '/tmp');
      const files = await fs.readdirSync(installDir + '/tmp', {
        withFileTypes: true
      });
      core.debug(`files: ${files.join(' ')}`);
      core.debug(`mv ${installDir}/tmp/${files[0]} ${installDir}/stack`);
      await io.mv(`${installDir}/tmp/${files[0]}`, `${installDir}/stack`);
      break;
    case 'zip':
      await tc.extractZip(tmpPath, installDir);
      break;
  }
  core.addPath(installDir);
  await io.rmRF(tmpPath);
}

function _buildArchiveLink(version: string, target: string): string {
  if (version == 'latest') {
    return `https://get.haskellstack.org/stable/${target}`;
  }
  const repository = 'https://github.com/commercialhaskell/stack';
  return `${repository}/releases/download/v${version}/stack-${version}-${target}`;
}

import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import * as path from 'path';

export async function installHaskellStack(version: string) {
  switch (process.platform) {
    case 'linux':
      await _install(
        path.join(process.env.HOME, '.local', 'bin'),
        _buildArchiveLink(version, 'linux-x86_64.tar.gz')
      );
      break;
    case 'darwin':
      await _install(
        path.join(process.env.HOME, '.local', 'bin'),
        _buildArchiveLink(version, 'osx-x86_64.tar.gz')
      );
      break;
    case 'win32':
      await _install(
        path.join(process.env.APPDATA, 'local', 'bin'),
        _buildArchiveLink(version, 'windows-x86_64.zip'),
        true
      );
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

function _buildArchiveLink(version: string, target: string): string {
  if (version == 'latest') {
    return `https://get.haskellstack.org/stable/${target}`;
  }
  const repository = 'https://github.com/commercialhaskell/stack';
  return `${repository}/releases/download/v${version}/stack-${version}-${target}`;
}

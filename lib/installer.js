"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const io = __importStar(require("@actions/io"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function installHaskellStack(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let installDir;
        switch (process.platform) {
            case 'linux':
                installDir = path.join(process.env.HOME, '.local', 'bin');
                yield _install(installDir, version, 'linux-x86_64', 'tar.gz');
                break;
            case 'darwin':
                installDir = path.join(process.env.HOME, '.local', 'bin');
                yield _install(installDir, version, 'osx-x86_64', 'tar.gz');
                break;
            case 'win32':
                installDir = path.join(process.env.APPDATA, 'local', 'bin');
                yield _install(installDir, version, 'windows-x86_64', 'zip');
                break;
            default:
                throw new Error(`unsupported OS: ${process.platform}`);
        }
    });
}
exports.installHaskellStack = installHaskellStack;
function _install(installDir, version, platform, extension) {
    return __awaiter(this, void 0, void 0, function* () {
        const archiveLink = _buildArchiveLink(version, `${platform}.${extension}`);
        const tmpPath = yield tc.downloadTool(archiveLink);
        switch (extension) {
            case 'tar.gz':
                yield tc.extractTar(tmpPath, installDir + '/tmp');
                const files = yield fs.readdirSync(installDir + '/tmp', {
                    withFileTypes: true
                });
                core.debug(files.join(' '));
                yield io.mv(`${installDir}/tmp/${files[0]}`, `${installDir}/stack`);
                core.debug(`mv ${installDir}/tmp/${files[0]} ${installDir}/stack`);
                break;
            case 'zip':
                yield tc.extractZip(tmpPath, installDir);
                break;
        }
        core.addPath(installDir);
        yield io.rmRF(tmpPath);
    });
}
function _buildArchiveLink(version, target) {
    if (version == 'latest') {
        return `https://get.haskellstack.org/stable/${target}`;
    }
    const repository = 'https://github.com/commercialhaskell/stack';
    return `${repository}/releases/download/v${version}/stack-${version}-${target}`;
}

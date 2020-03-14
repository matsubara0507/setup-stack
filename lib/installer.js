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
const exec = __importStar(require("@actions/exec"));
const path = __importStar(require("path"));
function installHaskellStack(version) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'https://get.haskellstack.org/stable';
        let installDir;
        switch (process.platform) {
            case 'linux':
                installDir = path.join(process.env.HOME, '.local', 'bin');
                yield _install(installDir, `${baseUrl}/linux-x86_64.tar.gz`);
                yield _upgrade(version, true);
                break;
            case 'darwin':
                installDir = path.join(process.env.HOME, '.local', 'bin');
                yield _install(installDir, `${baseUrl}/osx-x86_64.tar.gz`);
                yield _upgrade(version, true);
                break;
            case 'win32':
                installDir = path.join(process.env.APPDATA, 'local', 'bin');
                yield _install(installDir, `${baseUrl}/windows-x86_64.zip`, true);
                yield _upgrade(version);
                break;
            default:
                throw new Error(`unsupported OS: ${process.platform}`);
        }
    });
}
exports.installHaskellStack = installHaskellStack;
function _install(installDir, installUrl, isZip) {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpPath = yield tc.downloadTool(installUrl);
        const extractedDir = yield (isZip
            ? tc.extractZip(tmpPath, installDir)
            : tc.extractTar(tmpPath, installDir));
        core.addPath(extractedDir);
        core.debug(`add path: ${extractedDir}`);
        yield io.rmRF(tmpPath);
    });
}
function _upgrade(version, sudo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (version != 'latest') {
            core.debug(`upgrade stack to ${version}`);
            if (sudo) {
                yield exec.exec('sudo', [
                    'stack',
                    'upgrade',
                    '--binary-version',
                    version
                ]);
            }
            else {
                yield exec.exec('stack', ['upgrade', '--binary-version', version]);
            }
        }
    });
}

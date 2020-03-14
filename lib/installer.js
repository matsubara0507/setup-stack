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
function installHaskellStack(version) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (process.platform) {
            case 'linux':
                yield _install(path.join(process.env.HOME, '.local', 'bin'), _buildArchiveLink(version, 'linux-x86_64.tar.gz'));
                break;
            case 'darwin':
                yield _install(path.join(process.env.HOME, '.local', 'bin'), _buildArchiveLink(version, 'osx-x86_64.tar.gz'));
                break;
            case 'win32':
                yield _install(path.join(process.env.APPDATA, 'local', 'bin'), _buildArchiveLink(version, 'windows-x86_64.zip'), true);
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
function _buildArchiveLink(version, target) {
    if (version == 'latest') {
        return `https://get.haskellstack.org/stable/${target}`;
    }
    const repository = 'https://github.com/commercialhaskell/stack';
    return `${repository}/releases/download/v${version}/stack-${version}-${target}`;
}

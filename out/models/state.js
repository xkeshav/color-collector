"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtensionVersion = exports.State = exports.getExtension = void 0;
const vscode = require("vscode");
const extensionId = 'xkeshav.color-collector';
function getExtension() {
    let extension;
    const ext = vscode.extensions.getExtension(extensionId);
    if (!ext) {
        throw new Error('Extension was not found.');
    }
    if (ext) {
        extension = ext;
    }
    return extension;
}
exports.getExtension = getExtension;
class State {
    static get extensionContext() {
        return this._extContext;
    }
    static set extensionContext(ec) {
        this._extContext = ec;
    }
}
exports.State = State;
function getExtensionVersion() {
    const extension = getExtension();
    const version = extension ? extension.packageJSON.version : '';
    return version;
}
exports.getExtensionVersion = getExtensionVersion;
//# sourceMappingURL=state.js.map
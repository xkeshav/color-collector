"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "css-variable-generator" is now active!');
    let timeout = undefined;
    const command = 'css-variable-generator.init';
    const commandHandler = () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello CSS World from css variable generator!');
    };
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(command, commandHandler);
    /** work starts here */
    let activeEditor = vscode.window.activeTextEditor;
    async function replaceWithinDocument() {
        if (!activeEditor) {
            return;
        }
        const text = activeEditor.document.getText();
        console.log({ text });
        const reg = new RegExp('(?<color>#[0-9a-f]{3,6})', 'gim');
        const matches = text.matchAll(reg);
        const variableList = {};
        let i = 0;
        for (const match of matches) {
            const { index, groups } = match;
            i++;
            console.log({ match });
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            console.log({ i, startPos, endPos });
            //Creating a new range with startLine, startCharacter & endLine, endCharacter.
            let range = new vscode.Range(startPos, endPos);
            // To ensure that above range is completely contained in this document.
            let validFullRange = activeEditor.document.validateRange(range);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Object.assign(variableList, { [`--var-${i}`]: groups?.color });
            await activeEditor.edit(editBuilder => {
                console.log('replacing...');
                editBuilder.replace(range, `var(--var-${i})`);
            });
        }
        const firstPos = new vscode.Position(0, 2);
        const lastPos = new vscode.Position(Object.keys(variableList).length + 2, 0);
        const topRange = new vscode.Range(firstPos, lastPos);
        //activeEditor.edit(editBuilder => {
        //	console.log('inserting...');
        //	const text = `::root { }`;
        //	console.log({ text });
        //	editBuilder.insert(firstPos, text);
        //});
        console.log({ variableList });
    }
    function triggerUpdateDecorations(throttle = false) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
        if (throttle) {
            timeout = setTimeout(replaceWithinDocument, 500);
        }
        else {
            replaceWithinDocument();
        }
    }
    if (activeEditor) {
        triggerUpdateDecorations();
    }
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
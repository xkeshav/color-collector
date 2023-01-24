"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const common_1 = require("./utils/common");
const constants_1 = require("./utils/constants");
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
    const combinedPatternWithProperty = `${constants_1.PATTERN_LIST.PROPERTY}(${common_1.combinedPattern})`;
    console.log({ combinedPatternWithProperty });
    function replaceWithinDocument() {
        if (!activeEditor) {
            return;
        }
        const { document } = activeEditor;
        const text = document.getText();
        //console.log({ text });
        //console.log([...selectorMatchList]);
        // Add some CSS
        //stylesheet.replaceSync(text);
        //console.log({ stylesheet });
        const variableList = {};
        const selectorList = new Map();
        activeEditor.edit(editBuilder => {
            selectorFinder(text);
            function selectorFinder(cssDocument) {
                const selectorRegex = new RegExp(constants_1.PATTERN_LIST.SELECTOR_WITH_MEDIA.source, 'imgd');
                const selectorMatchList = cssDocument.matchAll(selectorRegex);
                for (const matchingSelector of selectorMatchList) {
                    const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = matchingSelector;
                    const { SELECTOR: selectorName } = selectorGroup;
                    const { SELECTOR: selectorIndex } = selectorIndicesGroup;
                    const [, last] = selectorIndex;
                    const wordRegex = new RegExp(constants_1.PATTERN_LIST.WORD, 'img');
                    const [selector] = selectorName.match(wordRegex);
                    console.log({ selector });
                    selectorList.set(last, selector);
                }
            }
            colorFinder(text);
            function colorFinder(cssDocument) {
                var _a;
                let i = 0;
                const colorRegex = new RegExp(common_1.combinedPattern, 'imgd');
                const colorMatchList = cssDocument.matchAll(colorRegex);
                for (const match of colorMatchList) {
                    i++;
                    console.log(match);
                    const { groups, indices: { groups: indicesGroup } } = match;
                    const { HEX_COLOR, NON_HEX_COLOR } = groups;
                    const colorIndexList = (_a = indicesGroup.HEX_COLOR) !== null && _a !== void 0 ? _a : indicesGroup.NON_HEX_COLOR;
                    let [start, end] = colorIndexList;
                    const selectorPositionIndex = Array.from(selectorList.keys());
                    const selectorKey = selectorPositionIndex.findLast((sl) => sl < start);
                    const selectorName = selectorList.get(selectorKey);
                    console.log({ selectorName });
                    const variableName = `--var-${selectorName}-${i}`;
                    const variableValue = HEX_COLOR || NON_HEX_COLOR;
                    Object.assign(variableList, { [variableName]: variableValue });
                    const startPos = document.positionAt(start);
                    const endPos = document.positionAt(end);
                    //Creating a new range with startLine, startCharacter & endLine, endCharacter.
                    let range = new vscode.Range(startPos, endPos);
                    editBuilder.replace(range, `var(${variableName})`);
                }
            }
        }).then(async (resolved) => {
            console.log({ resolved });
            console.log({ selectorList });
            //Array.from(variableList.values());
            const rootContent = (0, common_1.createRootSelector)(variableList);
            insertRootContent(rootContent);
        });
        const insertRootContent = (content) => {
            //const edit = new vscode.WorkspaceEdit();
            //edit.insert(YOUR_URI, new vscode.Position(0, 0), rootContent);
            //let success = await vscode.workspace.applyEdit(edit);
            activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.edit(editBuilder => {
                editBuilder.insert(new vscode.Position(0, 0), content + '\n\n');
            });
        };
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
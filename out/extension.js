"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const vscode = require("vscode");
const common_1 = require("./utils/common");
const constants_1 = require("./utils/constants");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "css-color-collector" is now active!');
    let timeout = undefined;
    const command = 'css-color-collector.init';
    const commandHandler = () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello CSS World from css color Collector!');
    };
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(command, commandHandler);
    /** work starts here */
    let activeEditor = vscode.window.activeTextEditor;
    const variableList = {};
    const selectorList = new Map();
    let propertyName = ''; // use to respected property name which is in previous capture group in regex
    //console.log({ combinedPatternWithProperty });
    function replaceWithinDocument() {
        if (!activeEditor) {
            return;
        }
        const { document } = activeEditor;
        const text = document.getText();
        //console.log({ text });
        function selectorFinder(cssDocument) {
            let selector = '';
            const selectorRegex = new RegExp(constants_1.PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
            const selectorMatchList = cssDocument.matchAll(selectorRegex);
            for (const matchingSelector of selectorMatchList) {
                const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = matchingSelector;
                const { SELECTOR: selectorName } = selectorGroup;
                const { SELECTOR: selectorIndex } = selectorIndicesGroup;
                const [, lastIndex] = selectorIndex;
                let trimmedSelectorName = selectorName.trim();
                //console.log({trimmedSelectorName});
                if (trimmedSelectorName === '*') { // special case
                    selector = 'starSelector';
                }
                else {
                    if (trimmedSelectorName.startsWith('@keyframes')) { // capture keyframe identifier 
                        [, trimmedSelectorName] = trimmedSelectorName.split(' ');
                    }
                    const wordRegex = new RegExp(constants_1.PATTERN_LIST.WORD, 'img');
                    const [firstMatch] = trimmedSelectorName.match(wordRegex);
                    selector = firstMatch;
                }
                //console.log({ selector });
                selectorList.set(lastIndex, selector);
            }
        }
        activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.edit(editBuilder => {
            selectorFinder(text);
            //console.log({ selectorList });
            colorFinder(text);
            function colorFinder(cssDocument) {
                let num = 0;
                let variableName = '';
                const colorRegex = new RegExp(common_1.combinedColorPattern, 'imgd');
                const colorMatchList = cssDocument.matchAll(colorRegex);
                for (const matchingColor of colorMatchList) {
                    //console.log({matchingColor});
                    let isColorVariableExist = false;
                    const { groups: colorGroup, indices: { groups: indicesGroup } } = matchingColor;
                    const { PROPERTY, HEX_COLOR, NON_HEX_COLOR, COLOR_NAME } = colorGroup;
                    if (PROPERTY !== undefined) {
                        propertyName = PROPERTY;
                    }
                    else {
                        const colorValue = HEX_COLOR || NON_HEX_COLOR || COLOR_NAME;
                        //console.log({colorValue});
                        if (HEX_COLOR) {
                            [isColorVariableExist, variableName] = (0, common_1.checkDuplicateHexColor)(HEX_COLOR, variableList);
                        }
                        else {
                            [isColorVariableExist, variableName] = (0, common_1.checkDuplicateNonHexColor)(colorValue, variableList);
                        }
                        //console.log({variableName, isColorVariableExist});
                        const colorIndexList = indicesGroup.HEX_COLOR || indicesGroup.NON_HEX_COLOR || indicesGroup.COLOR_NAME;
                        const [start, end] = colorIndexList;
                        if (!isColorVariableExist) {
                            num++;
                            const selectorName = (0, common_1.getParentSelectorName)(selectorList, start);
                            variableName = (0, common_1.setVariableName)({ selectorName, num, propertyName });
                            Object.assign(variableList, { [variableName]: colorValue.toLowerCase() });
                        }
                        //console.log({variableName});
                        //console.log({variableList});
                        const startPos = document.positionAt(start);
                        const endPos = document.positionAt(end);
                        //Creating a new range with startLine, startCharacter & endLine, endCharacter.
                        const range = new vscode.Range(startPos, endPos);
                        editBuilder.replace(range, `var(${variableName})`);
                    }
                }
            }
        }).then(async () => {
            const rootContent = (0, common_1.createRootSelector)(variableList);
            insertRootContent(rootContent);
        });
        function insertRootContent(content) {
            const importRegex = new RegExp(constants_1.PATTERN_LIST.IMPORT_STMT, 'imgd');
            const importMatchList = text.matchAll(importRegex);
            const importMatchDetails = [...importMatchList];
            let position = new vscode.Position(0, 0);
            if (importMatchDetails.length) {
                const lastImportStatement = importMatchDetails.pop();
                ;
                const { input, index } = lastImportStatement;
                // find line number on last @import statement and place :root after that
                const line = input.substr(0, index).match(/\n/g).length + 1;
                position = new vscode.Position(line, 0);
            }
            activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.edit(editBuilder => {
                editBuilder.insert(position, `\n${content}\n`);
            });
        }
        ;
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
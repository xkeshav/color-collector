/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { RegExpMatchArrayWithIndices, SelectorMap, VariableList } from './models/base';
import { combinedPattern, createRootSelector, getParentSelectorName, hexColorVariation, setVariableName } from './utils/common';
import { PATTERN_LIST } from './utils/constants';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "css-variable-generator" is now active!');

	let timeout: NodeJS.Timer | undefined = undefined;

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

	const variableList: VariableList = {};
	const selectorList: SelectorMap = new Map();

	let propertyName = ''; // use to respected property name which is in previous capture group in regex

	//console.log({ combinedPatternWithProperty });

	function replaceWithinDocument() {
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const text = document.getText();
		//console.log({ text });

		function selectorFinder(cssDocument: string) {
			let selector = '';
			const selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
			const selectorMatchList = cssDocument.matchAll(selectorRegex);
			for (const matchingSelector of selectorMatchList) {
				const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = matchingSelector as RegExpMatchArrayWithIndices;
				const { SELECTOR: selectorName } = selectorGroup!;
				const { SELECTOR: selectorIndex } = selectorIndicesGroup;
				const [, lastIndex] = selectorIndex;
				//console.log({selectorName});
				if (selectorName.trim() === '*') { // special case
					selector = 'starSelector';
				} else {
					const wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
					const [firstMatch] = selectorName.match(wordRegex) as [string];
					selector = firstMatch;
				}
				//console.log({ selector });
				selectorList.set(lastIndex, selector);
			}
		}

		activeEditor?.edit(editBuilder => {
			selectorFinder(text);
			//console.log({ selectorList });
			colorFinder(text);
			function colorFinder(cssDocument: string) {
				let num = 0;
				let variableName = '';
				const colorRegex = new RegExp(combinedPattern, 'imgd');
				const colorMatchList = cssDocument.matchAll(colorRegex);
				for (const matchingColor of colorMatchList) {
					//console.log({matchingColor});
					let existingVariable = true;
					const { groups: colorGroup, indices: { groups: indicesGroup } } = matchingColor as RegExpMatchArrayWithIndices;
					const { PROPERTY, HEX_COLOR, NON_HEX_COLOR } = colorGroup!;
					if (PROPERTY !== undefined) {
						propertyName = PROPERTY;
					} else {
						const colorIndexList = indicesGroup.HEX_COLOR ?? indicesGroup.NON_HEX_COLOR;
						const [start, end] = colorIndexList;
						let colorValue = HEX_COLOR || NON_HEX_COLOR;
						// check variation of all kind of hex value
						if (HEX_COLOR) {
							const hexVariationList = hexColorVariation(HEX_COLOR) as string[];
							console.log({hexVariationList});
							console.log({variableList});
							const existingHexColor= Object.entries(variableList).find(([_, vv]) => hexVariationList.includes(vv) );
							if(existingHexColor === undefined) {
								existingVariable = false;
							} else {
								existingVariable = true;
								[variableName] = existingHexColor;
							}
						} 
						else {
							const nonHexVariableList = Object.entries(variableList).find(([_, vv]) => colorValue === vv);
							if(nonHexVariableList === undefined) {
								existingVariable = false;
							} else {
								existingVariable = true;
								[variableName] = nonHexVariableList;
							}
						}
						if (!existingVariable) {
							num++;
							const selectorName = getParentSelectorName(selectorList, start);
							variableName = setVariableName({ selectorName, num, propertyName });
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
			const rootContent = createRootSelector(variableList);
			insertRootContent(rootContent);
		});

		function insertRootContent(content: string) {
			const importRegex = new RegExp(PATTERN_LIST.IMPORT_STMT, 'imgd');
			const importMatchList = text.matchAll(importRegex);
			const importMatchDetails = [...importMatchList];
			let position = new vscode.Position(0, 0);
			if (importMatchDetails.length) {
				const lastImportStatement = importMatchDetails.pop() as RegExpMatchArrayWithIndices;;
				const { input, index } = lastImportStatement;
				// find line number on last @import statement and place :root after that
				const line = (input as any).substr(0, index).match(/\n/g).length + 1;
				position = new vscode.Position(line, 0);
			}

			activeEditor?.edit(editBuilder => {
				editBuilder.insert(position, `\n${content}\n`);
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
		} else {
			replaceWithinDocument();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() { }

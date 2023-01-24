import * as vscode from 'vscode';
import { RegExpMatchArrayWithIndices, VariableList } from './models/base';
import { combinedPattern, createRootSelector } from './utils/common';
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
	let disposable = vscode.commands.registerCommand(command, commandHandler)
		;
	/** work starts here */

	let activeEditor = vscode.window.activeTextEditor;

	const combinedPatternWithProperty = `${PATTERN_LIST.PROPERTY}(${combinedPattern})`;

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

		const variableList: VariableList = {};

		const selectorList: Map<number, string> = new Map();

		activeEditor.edit(editBuilder => {
			selectorFinder(text);

			function selectorFinder(cssDocument: string) {
				const selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA.source, 'imgd');
				const selectorMatchList = cssDocument.matchAll(selectorRegex);
				for (const matchingSelector of selectorMatchList) {
					const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = matchingSelector as RegExpMatchArrayWithIndices;
					const { SELECTOR: selectorName } = selectorGroup as VariableList;
					const { SELECTOR: selectorIndex } = selectorIndicesGroup;
					const [, last] = selectorIndex;
					const wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
					const [selector] = selectorName.match(wordRegex) as [string];
					console.log({ selector });
					selectorList.set(last, selector);
				}
			}
			colorFinder(text);

			function colorFinder(cssDocument: string) {
				let i = 0;
				const colorRegex = new RegExp(combinedPattern, 'mudig');
				const colorMatchList = cssDocument.matchAll(colorRegex);
				for (const match of colorMatchList) {
					i++;
					console.log(match);
					const { groups, indices: { groups: indicesGroup } } = match as RegExpMatchArrayWithIndices;
					const { PROPERTY, HEX_COLOR, NON_HEX_COLOR } = groups as VariableList;
					if (PROPERTY !== undefined) {
					} else {
						const colorIndexList = indicesGroup.HEX_COLOR ?? indicesGroup.NON_HEX_COLOR;
						let [start, end] = colorIndexList;
						const selectorPositionIndex = Array.from(selectorList.keys());
						const selectorKey = (selectorPositionIndex as any).findLast((sl: number) => sl < start);
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
			}
		}).then(async (resolved) => {
			console.log({ resolved });
			console.log({ selectorList });
			//Array.from(variableList.values());
			const rootContent = createRootSelector(variableList);
			insertRootContent(rootContent);
		});




		const insertRootContent = (content: string) => {
			//const edit = new vscode.WorkspaceEdit();
			//edit.insert(YOUR_URI, new vscode.Position(0, 0), rootContent);
			//let success = await vscode.workspace.applyEdit(edit);
			activeEditor?.edit(editBuilder => {
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

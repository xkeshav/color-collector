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

	function replaceWithinDocument() {
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const text = document.getText();
		//console.log({ text });

		const selectorRegex = new RegExp(PATTERN_LIST.SELECTOR, 'imgd');
		const selectorMatchList = text.matchAll(selectorRegex);

		const colorRegex = new RegExp(combinedPattern, 'imgd');
		const colorMatchList = text.matchAll(colorRegex);

		const variableList: VariableList = {};

		activeEditor.edit(editBuilder => {
			let i = 0;

			for (const sel of selectorMatchList) {
				const selectorName = sel.groups?.selector as string;
				const wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
				const [selector] = selectorName.match(wordRegex) as [string];
				console.log({ selector });
				for (const match of colorMatchList) {
					i++;
					const { groups, indices } = match as RegExpMatchArrayWithIndices;
					const { color: colorValue, color2: color2value } = groups as VariableList;
					const { groups: { color, color2 } } = indices;
					const variableName = `--var-${selector}-${i}`;
					Object.assign(variableList, { [variableName]: colorValue || color2value });
					//console.log({ match });
					const colorCode = color || color2;
					console.log({ colorCode });
					let [start, end] = colorCode;
					const startPos = document.positionAt(start);
					const endPos = document.positionAt(end);
					console.log({ i, startPos, endPos });
					//Creating a new range with startLine, startCharacter & endLine, endCharacter.
					let range = new vscode.Range(startPos, endPos);
					// To ensure that above range is completely contained in this document.
					//let validFullRange = document.validateRange(range);
					// eslint-disable-next-line @typescript-eslint/naming-convention
					editBuilder.replace(range, `var(${variableName})`);
				}
			}
		}).then(async (resolved) => {
			console.log({ resolved });
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

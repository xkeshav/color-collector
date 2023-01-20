import * as vscode from 'vscode';

import { RegExpMatchArrayWithIndices, VariableList } from './models/base';

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

	function replaceWithinDocument() {
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const text = document.getText();
		//console.log({ text });
		const selectorPattern = '^\s?(?<selector>(.+))\{([^}]+|\s+)}';
		const colorPattern = '(?<color>#[0-9a-fA-F]{3,8})';
		const wordPattern = '(\\w+)';


		const variableList: VariableList = {};

		activeEditor.edit(editBuilder => {
			let i = 0;

			const reg = new RegExp(selectorPattern, 'dimg');
			const matchedSelector = text.matchAll(reg);
			//console.log([...matchedSelector]);
			for (const selected of matchedSelector) {
				const selectorName = selected.groups?.selector as string;
				const wordRegex = new RegExp(wordPattern, 'img');
				const [selector] = selectorName.match(wordRegex) as [string];
				console.log({ selector });
				const block = selected[3];
				const reg = new RegExp(colorPattern, 'dimg');
				const matchedColor = text.matchAll(reg);
				for (const match of matchedColor) {
					i++;
					const variableName = `--var-${selector}-${i}`;
					Object.assign(variableList, { [variableName]: match.groups?.color });
					//console.log({ match });
					const [, [start, end]] = (match as RegExpMatchArrayWithIndices).indices;
					console.log({ start, end });
					//const matchStartPos = document.positionAt(start);
					//const matchEndPos = document.positionAt(end);
					const matchStartPos = document.positionAt(match.index!);
					const matchEndPos = document.positionAt(match.index! + match[0].length);
					console.log({ i, matchStartPos, matchEndPos });
					//Creating a new range with startLine, startCharacter & endLine, endCharacter.
					let range = new vscode.Range(matchStartPos, matchEndPos);
					// To ensure that above range is completely contained in this document.
					//let validFullRange = document.validateRange(range);
					// eslint-disable-next-line @typescript-eslint/naming-convention
					editBuilder.replace(range, `var(${variableName})`);
				}
			}
		}).then(async (resolved) => {
			const rootContent = createRootSelector(variableList);
			insertRootContent(rootContent);
		});

		const createRootSelector = (variableList: VariableList) => {
			const variableEntry = Object.entries(variableList).reduce((p, [k, v]) => p += `\t${k}: ${v};\n`, ``); // remember to put semicolon after every property declaration
			return `:root {\n${variableEntry}}\n\n`;
		};


		const insertRootContent = async (content: string) => {
			//const edit = new vscode.WorkspaceEdit();
			//edit.insert(YOUR_URI, new vscode.Position(0, 0), rootContent);
			//let success = await vscode.workspace.applyEdit(edit);
			console.log({ content });
			await activeEditor?.edit(editBuilder => {
				editBuilder.insert(new vscode.Position(0, 0), content);
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

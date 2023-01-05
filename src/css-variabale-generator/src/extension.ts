import * as vscode from 'vscode';

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

	context.subscriptions.push(disposable);

	/** work starts here */

	let activeEditor = vscode.window.activeTextEditor;


	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const text = activeEditor.document.getText();
		console.log({ text });

		let match;
		//while ((match = reg.exec(text))) {
		//	const startPos = activeEditor.document.positionAt(match.index);
		//	const endPos = activeEditor.document.positionAt(match.index + match[0].length);
		//	//const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
		//	console.log({ match, startPos, endPos });
		//}
	}


	function triggerUpdateDecorations(throttle = false) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		if (throttle) {
			timeout = setTimeout(updateDecorations, 500);
		} else {
			updateDecorations();
		}
	}

	if (activeEditor) {
		triggerUpdateDecorations();
	}

}

// This method is called when your extension is deactivated
export function deactivate() { }

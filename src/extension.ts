/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

import { Collector } from './utils/collector';
import { createRootContent } from './utils/common';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "css-color-collector" is now active!');

	const command = 'css-color-collector.init';
	const commandHandler = () => {
		vscode.window.showInformationMessage('Hello CSS World from css color Collector!');
	};
	let disposableInit = vscode.commands.registerCommand(command, commandHandler);

	/** work starts here */

	const collectCommand = 'css-color-collector.collect';

	function replaceWithinDocument() {
		let activeEditor = vscode.window.activeTextEditor;
		
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const cssDoc = document.getText();
		const collectorObject =  new Collector(cssDoc);
		activeEditor?.edit((editBuilder:vscode.TextEditorEdit) => {
			collectorObject.selectorFinder();
			collectorObject.colorFinder();
			const colorMapper = collectorObject.colorMapper;
			// replace color name with variable
			for (const [positionList, color] of colorMapper) {
				const [start, end] = positionList;
				const startPos = document.positionAt(start);
				const endPos = document.positionAt(end);
				const range = new vscode.Range(startPos, endPos);
				editBuilder.replace(range, `var(${color})`);
			}
		}).then(async () => {
			const variableList = collectorObject.variableList;
			const rootContent = createRootContent(variableList);
			const [initial, final] = collectorObject.getRootPosition();
			const position = new vscode.Position(initial, final);
			activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
				editBuilder.insert(position, `\n${rootContent}\n`);
				vscode.window.showInformationMessage('variable conversion done by css color collector!');
			});
		});
	}


	let disposableCollect = vscode.commands.registerCommand(collectCommand, () => {
			replaceWithinDocument();
	});


	context.subscriptions.push(disposableInit,disposableCollect);

}


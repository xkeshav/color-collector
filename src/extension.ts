/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

import { Collector } from './utils/collector';
import { createRootContent } from './utils/common';

export function activate(context: vscode.ExtensionContext) {
	const collectCommand = 'css-color-collector.collect';

	function collectCommandHandler() {
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const cssDoc = document.getText();
		const collectorObject = new Collector(cssDoc);
		collectorObject.escapeRootProperty();
		const isAnyColorInDocument = collectorObject.hasAnyColorExist();
		if (isAnyColorInDocument) {
			activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
				collectorObject.selectorFinder();
				collectorObject.colorWithPropertyFinder();
				const colorMapper = collectorObject.colorMapper;
				console.log({ colorMapper });
				// replace color name with variable
				for (const [colorPosition, colorValue] of colorMapper) {
					const [start, end] = colorPosition;
					const startPos = document.positionAt(start);
					const endPos = document.positionAt(end);
					const range = new vscode.Range(startPos, endPos);
					editBuilder.replace(range, `var(${colorValue})`);
				}
			}).then(async () => {
				const variableList = collectorObject.variableList;
				const rootContent = createRootContent(variableList);
				const [first, last] = collectorObject.getRootPosition();
				const position = new vscode.Position(first, last);
				// insert color variable on css file under :root
				activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
					editBuilder.insert(position, `\n${rootContent}\n`);
					vscode.window.showInformationMessage('CSS variable conversion done successfully!');
				});
			});
		} else {
			vscode.window.showInformationMessage('There is no color in the css file.');
		}
	}

	let disposableCollect = vscode.commands.registerCommand(collectCommand, () => collectCommandHandler());

	context.subscriptions.push(disposableCollect);

}


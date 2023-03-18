/* eslint-disable @typescript-eslint/naming-convention */
import path = require('path');
import * as vscode from 'vscode';

import { Collector } from './utils/collector';
import { createRootContent } from './utils/common';
import { DOCUMENT_MINIMUM_LENGTH, rootComment } from './utils/constants';

export function activate(context: vscode.ExtensionContext) {

	const collectCommand = 'css-color-collector.collect';

	function collectCommandHandler() {
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const cssDoc = document.getText();
		if (cssDoc?.length < DOCUMENT_MINIMUM_LENGTH) {
			vscode.window.showInformationMessage('css file have no color property.');
		} else {
			const collectorObject = new Collector(cssDoc);
			const hasColorInDocument = collectorObject.verifyColorExistInDocument();
			if (!hasColorInDocument) {
				vscode.window.showInformationMessage('css file do not have any color value.');
			} else {
				activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
					collectorObject.selectorFinder();
					collectorObject.colorWithPropertyFinder();
					const colorMapper = collectorObject.colorMapper;
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
					//createFile(rootContent);
					const [first, last] = collectorObject.locateRootPosition();
					const position = new vscode.Position(first, last);
					// insert color variable on css file under :root
					activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
						editBuilder.insert(position, '');
						editBuilder.insert(position, `\n${rootComment}\r\n${rootContent}`);
						vscode.window.showInformationMessage('variable conversion done successfully!');
					});
				});
			}
		}
	}

	let disposableCollect = vscode.commands.registerCommand(collectCommand, () => collectCommandHandler());

	context.subscriptions.push(disposableCollect);

}

export async function createFile(content: string) {
	const fileName = 'collector.css';
	const wsEdit = new vscode.WorkspaceEdit();
	const wsPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
	const filePath = vscode.Uri.file(wsPath + '/' + fileName);
	vscode.window.showInformationMessage(filePath.toString());
	wsEdit.createFile(filePath, { overwrite: true  });
	const position = new vscode.Position(1, 0);
	wsEdit.insert(filePath, position, content);
	vscode.workspace.applyEdit(wsEdit);
	vscode.window.showInformationMessage('created a new file: => ' + fileName);
	await vscode.workspace.openTextDocument(filePath);
  vscode.window.showTextDocument(filePath);
}


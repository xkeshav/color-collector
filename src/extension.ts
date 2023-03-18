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
					// check user configure to create root in separate file
					const hasRootInSeparateFile = vscode.workspace.getConfiguration().get('cssColorCollector.rootInSeparateFile');
					const rootBlockOfCssCollector = `\n${rootComment}\r\n${rootContent}`;
					let rootFileName: string;
					if (hasRootInSeparateFile) {
						rootFileName = separateRootFileName();
						createSeparateRootFile(rootBlockOfCssCollector, rootFileName);
					}
					const [first, last] = collectorObject.locateRootPosition();
					const position = new vscode.Position(first, last);
					activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
						editBuilder.insert(position, '');
						if(hasRootInSeparateFile) {
							const importUrl = `\n/* import below file by css color collector */\n@import url('${rootFileName}');\n\n`;
							editBuilder.insert(position, importUrl);
						} else {
							// insert color variable on css file under :root
							editBuilder.insert(position, rootBlockOfCssCollector);
						}
						vscode.window.showInformationMessage('color collection done successfully!');
					});

				});
			}
		}
	}

	const disposableCollect = vscode.commands.registerCommand(collectCommand, () => collectCommandHandler());

	context.subscriptions.push(disposableCollect);

}

export function separateRootFileName() {
	const openFile = vscode.window.activeTextEditor?.document.fileName;
	const fileNameOnly = openFile ? path.basename(openFile).split('.').shift() : 'color-collector';
	const fileName = `root-${fileNameOnly}-collector.css`;
	return fileName;
}

export async function createSeparateRootFile(content: string, fileName: string) {
	const wsEdit = new vscode.WorkspaceEdit();
	const wsPath = (vscode.workspace.workspaceFolders as vscode.WorkspaceFolder[])[0].uri.fsPath;
	const filePath = vscode.Uri.file(wsPath + '/' + fileName);
	vscode.window.showInformationMessage(filePath.toString(true));
	wsEdit.createFile(filePath, { overwrite: true });
	const position = new vscode.Position(1, 0);
	wsEdit.insert(filePath, position, content);
	await vscode.workspace.applyEdit(wsEdit);
	vscode.window.showInformationMessage('created a separate file: => ' + fileName);
	await vscode.workspace.openTextDocument(filePath);
	vscode.window.showTextDocument(filePath);
}


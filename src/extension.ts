/* eslint-disable @typescript-eslint/naming-convention */
import path = require('path');
import * as vscode from 'vscode';

import { Collector } from './utils/collector';
import { createRootContent, importFileComment, notFoundInFile, successInfo } from './utils/common';
import { DOCUMENT_MINIMUM_LENGTH, importComment, newFilePrefix, rootComment } from './utils/constants';

export function activate(context: vscode.ExtensionContext) {

	const collectCommand = 'css-color-collector.collect';

	// check user configure whether create root in separate file is enabled by user
	const config = vscode.workspace.getConfiguration();
	const useSeparateFileConfigEnabled = config.get('cssColorCollector.colorInSeparateFile');

	function collectCommandHandler() {
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		const { document } = activeEditor;
		const { uri, isUntitled, isDirty } = document;
		// check whether open file is new unsaved file and create in new file option enabled then stop execution of command
		if (useSeparateFileConfigEnabled && isUntitled) {
			vscode.window.showErrorMessage('please save the file first!');
			return;
		}
		// check for any error in the file which makes file invalid then stop execution of command
		const diagnosticArray = vscode.languages.getDiagnostics(uri);
		const errorList = diagnosticArray.filter(diag => diag.severity === 0);
		if (errorList.length) {
			vscode.window.showErrorMessage('invalid css file, please check error in PROBLEMS tab.');
			return;
		}
		// check unsaved status of file and give warning 
		if (isDirty) {
			vscode.window.showWarningMessage('please save the changes in file.');
		}

		const { fsPath } = uri;
		const { base, name } = path.parse(fsPath);
		const cssDoc = document.getText();

		if (cssDoc?.length < DOCUMENT_MINIMUM_LENGTH) {
			vscode.window.showInformationMessage(notFoundInFile('property', base));
		} else {
			const collectorObject = new Collector(cssDoc);
			const hasColorInDocument = collectorObject.verifyAnyColorExistInDocument();
			if (!hasColorInDocument) {
				vscode.window.showInformationMessage(notFoundInFile('value', base));
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
					let newFileName: string;
					if (useSeparateFileConfigEnabled) {
						const importFileContent = `${importFileComment(base)}\r\n${rootContent}`;
						newFileName = `${newFilePrefix}-${name ?? '-new-file'}.css`;
						createSeparateRootFile(importFileContent, newFileName);
					}
					const [first, last] = collectorObject.locateRootPosition();
					const position = new vscode.Position(first, last);
					activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
						editBuilder.insert(position, '');
						if (useSeparateFileConfigEnabled) {
							// create new css file which have all color variable and add import statement on top of file
							const importUrl = `${importComment}\n@import url('./${newFileName}');\n`;
							editBuilder.insert(position, importUrl);
						} else {
							// add :root on top of file on same css file
							editBuilder.insert(position, `${rootComment}\r\n${rootContent}`);
						}
						vscode.window.showInformationMessage(successInfo(base));
					});

				});
			}
		}
	}

	const disposableCollect = vscode.commands.registerCommand(collectCommand, () => collectCommandHandler());
	context.subscriptions.push(disposableCollect);
}

export async function createSeparateRootFile(content: string, newFileName: string) {
	const fileDirectory = fetchFileDirectoryPath();
	const fileLocation = vscode.Uri.parse(fileDirectory + path.sep + newFileName);
	const wsEdit = new vscode.WorkspaceEdit();
	// overwrite the file if already exist
	wsEdit.createFile(fileLocation, { overwrite: true });
	const position = new vscode.Position(1, 0);
	wsEdit.insert(fileLocation, position, content);
	await vscode.workspace.applyEdit(wsEdit);
	vscode.window.showInformationMessage('separate file created ' + newFileName);
	await vscode.workspace.openTextDocument(fileLocation);
	vscode.window.showTextDocument(fileLocation);
}

/* create new file on parallel to open file's directory */

function fetchFileDirectoryPath() {
	const document = vscode.window.activeTextEditor?.document;
	const { uri: { fsPath } } = document!;
	const file = vscode.Uri.file(fsPath);
	const openFileDirectoryPath = path.dirname(file.path);
	const workspaces = vscode.workspace.workspaceFolders;
	let workSpaceRootPath;
	// when a folder opened in explorer then there will be workspace
	if (workspaces) {
		const workSpaceRoot = workspaces![0];
		const { uri } = workSpaceRoot;
		workSpaceRootPath = uri.fsPath;
	}
	const dirPath = (workSpaceRootPath !== openFileDirectoryPath) ? openFileDirectoryPath : workSpaceRootPath;
	//vscode.window.showInformationMessage(dirPath.toString(true));
	return dirPath;
}

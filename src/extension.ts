/* eslint-disable @typescript-eslint/naming-convention */
import path = require('path');
import * as vscode from 'vscode';

import { Collector } from './utils/collector';
import { createRootContent, importDetailComment, notFoundInFile, successInfo } from './utils/common';
import { DOCUMENT_MINIMUM_LENGTH } from './utils/constants';
import { importComment, invalidFileErrorMessage, newFilePrefix, rootComment, unsavedChangesWarningMessage, untitledFileErrorMessage } from './utils/messages';

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
			vscode.window.showErrorMessage(untitledFileErrorMessage);
			return;
		}
		// check for any error in the file which makes file invalid then stop execution of command
		const diagnosticArray = vscode.languages.getDiagnostics(uri);
		const errorList = diagnosticArray.filter(diag => diag.severity === 0);
		if (errorList.length) {
			vscode.window.showErrorMessage(invalidFileErrorMessage);
			return;
		}
		// check unsaved status of the opened file and give warning 
		if (isDirty) {
			vscode.window.showWarningMessage(unsavedChangesWarningMessage);
		}

		const { base } = path.parse(uri.fsPath);
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
						const importFileContent = `${importDetailComment(base)}\r\n${rootContent}`;
						newFileName = await createSeparateRootFile(importFileContent);
					}
					const [first, last] = collectorObject.locateImportPosition() as number[];
					const position = new vscode.Position(first, last);
					activeEditor?.edit((editBuilder: vscode.TextEditorEdit) => {
						editBuilder.insert(position, '');
						if (useSeparateFileConfigEnabled) {
							// create new file which contains :root block and add import statement on top of the opened file
							const importContent = `${importComment}\n@import url('${newFileName}');\n`;
							editBuilder.insert(position, importContent);
						} else {
							// add :root on top of file on same css file
							editBuilder.insert(position, `${rootComment}\r\n${rootContent}`);
						}
						vscode.window.showInformationMessage(successInfo(base));
					}).then(undefined, _ => {
						vscode.window.showErrorMessage('closing the file while executing command might give wrong result.');
					});
				});
			}
		}
	}

	const disposableCollect = vscode.commands.registerCommand(collectCommand, () => collectCommandHandler());
	context.subscriptions.push(disposableCollect);
}

/* create separate file and return new file name  */
export async function createSeparateRootFile(content: string) {
	const [fileDirectory, fileName] = getOpenFileDirectory();
	const newFileName = `${newFilePrefix}-${fileName.toLowerCase()}.css`;
	const fileLocation = vscode.Uri.parse(fileDirectory + path.sep + newFileName);
	const wsEdit = new vscode.WorkspaceEdit();
	// overwrite the file if already exist
	wsEdit.createFile(fileLocation, { overwrite: true });
	const position = new vscode.Position(1, 0);
	wsEdit.insert(fileLocation, position, content);
	await vscode.workspace.applyEdit(wsEdit);
	vscode.window.showInformationMessage('a new file created => ' + newFileName);
	await vscode.workspace.openTextDocument(fileLocation);
	vscode.window.showTextDocument(fileLocation);
	return newFileName;
}

/* create new file on parallel to open file's directory */

function getOpenFileDirectory() {
	const document = vscode.window.activeTextEditor?.document;
	const { uri: { fsPath }, fileName } = document!;
	const { name: openFileName } = path.parse(fileName);
	const file = vscode.Uri.file(fsPath);
	const openFileDirectoryPath = path.dirname(file.path);
	const workspaces = vscode.workspace.workspaceFolders;
	let workspaceRootPath;
	// when a folder opened in explorer then there will be a default workspace
	if (workspaces) {
		const workspaceRoot = workspaces[0];
		workspaceRootPath = workspaceRoot.uri.path;
	}
	// in case when workspace is different and file open from other location
	const dirPath = (workspaceRootPath === openFileDirectoryPath) ? workspaceRootPath : openFileDirectoryPath;
	//vscode.window.showInformationMessage(dirPath.toString());
	return [dirPath, openFileName];
}

import * as assert from 'assert';
import path = require('path');


// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';


const testFolderLocation = '/../../sample/';


suite('Extension Test Suite', () => {
	after(() => {
    vscode.window.showInformationMessage('All tests done!');
  });
	vscode.window.showInformationMessage('Start all tests.');

	const getFileText = async (file: string) => {
		const uri = vscode.Uri.file(
			path.resolve(__dirname + testFolderLocation + file)
		);
		console.log({ uri });
		const document = await vscode.workspace.openTextDocument(uri);
		const activeEditor = await vscode.window.activeTextEditor;
		const text = document.getText();
		return text;
	};

	suite('extension setup', () => {

		test('should load css file', async () => {
			const text = await getFileText('test.css');
			console.log({ text });
			assert.notEqual(text, '');
		});

		test('display message on init command', () => {
			vscode.commands.executeCommand('css-color-collector.init');
		});

	});

});
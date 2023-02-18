import * as assert from 'assert';
import path = require('path');


import { commands, Disposable, Extension, extensions, Uri, window, workspace } from 'vscode';
import { extensionID } from '../../utils/constants';


const testFolderLocation = '/../../sample/';

const wait = async (seconds: number = 200) => new Promise(resolve => setTimeout(resolve, seconds*1000));

const disposables: Disposable[] = [];


const getFileText = async (file: string) => {
	const uri = Uri.file(
		path.resolve(__dirname + testFolderLocation + file)
	);
	const document = await workspace.openTextDocument(uri);
	await window.showTextDocument(document);
	const text = document.getText();
	return text;
};


suite('Extension Test Suite', () => {
	window.showInformationMessage('Start all tests.');
	let extension: Extension<any>;
	suiteSetup(() => {
		extension = extensions.getExtension(extensionID) as Extension<any>;
	});

	test('Extension should be present', () => {
		assert.ok(extensions.getExtension(extensionID));
	});

	test('extension package.json exists', () => {
		assert.notEqual(extension.packageJSON, undefined);
	});


	test('Activation test', async () => {
		await extension.activate();
		assert.equal(extension.isActive, true);
	});

	test('Extension loads in VSCode and is active', async () => {
		await wait(10);
		assert.equal(extension.isActive, true);
	});

});
suite('It registers color-collector commands successfully', () => {
	let commandList: string[];
	suiteSetup((done) => {
		commands.getCommands().then(commands => {
			commandList = commands;
			done();
		});
	});

	test('It registers the css-color-collector.collect command', (done) => {
		assert.ok(commandList.includes('css-color-collector.collect'));
		done();
	});
});

suite('extension setup', () => {
	test('run collect command', async () => {
		const text = await getFileText('test.css');
		await commands.executeCommand('css-color-collector.collect');
		await wait(5);
		// check after change
		const textNow = await getFileText('test.css');

		const expectedDocument = `
		
		:root {
			--body__txt--1: #fff;
			--body__bg--2: #123d;
			--main__txt__fill--3: purple;
		}
		
		body {
			color:var(--body__txt--1);
			background-color: var(--body__bg--2);
		}
		
		main {
			color: var(--body__txt--1);
			-webkit-text-fill-color: var(--main__txt__fill--3);
		}
		`;
		console.log({ textNow });
		assert.strictEqual(textNow, expectedDocument);
	});
	
	suiteTeardown(async () => {
    console.log('Disposing all resources');
    disposables.forEach((d) => d.dispose());
  });
});

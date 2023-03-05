import * as assert from 'assert';
import { commands, Disposable, Extension, extensions, Uri, window, workspace } from 'vscode';
import { extensionID } from '../../utils/constants';
import path = require('path');

const testFolderLocation = '/../../../sample/';
const disposables: Disposable[] = [];

const wait = async (seconds: number = 200) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const getFileText = async (file: string) => {
	const uri = Uri.file(path.resolve(__dirname + testFolderLocation + file));
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

suite('extension registers the collect commands successfully', () => {
	let commandList: string[];
	suiteSetup((done) => {
		commands.getCommands().then(commands => {
			commandList = commands;
			done();
		});
	});

	test('commandList should have css-color-collector.collect command', (done) => {
		assert.ok(commandList.includes('css-color-collector.collect'));
		done();
	});
});

suite('collect command execution on css file', () => {
	test('convert colors into variables in css file', async () => {
		await getFileText('test.css');
		await commands.executeCommand('css-color-collector.collect');
		await wait(5);
		// check after change in the css file
		const convertedCSSDoc = await getFileText('test.css');
		const expectedCSSDoc = await getFileText('test-after-command.css');
		//console.log({ convertedCSSDoc });
		assert.strictEqual(convertedCSSDoc, expectedCSSDoc);
	});

	test('convert colors in css not the property with color name', async () => {
		await getFileText('name.css');
		await commands.executeCommand('css-color-collector.collect');
		await wait(5);
		// check after change in file
		const convertedCSSDoc = await getFileText('name.css');
		const expectedCSSDoc = await getFileText('name-after-command.css');
		//console.log({ convertedCSSDoc });
		assert.strictEqual(convertedCSSDoc, expectedCSSDoc);
	});

	test('skip pre defined :root block and its property', async () => {
		await getFileText('multi-root.css');
		await commands.executeCommand('css-color-collector.collect');
		await wait(5);
		// check after change in file
		const convertedCSSDoc = await getFileText('multi-root.css');
		const expectedCSSDoc = await getFileText('multi-root-after-command.css');
		//console.log({ convertedCSSDoc });
		assert.strictEqual(convertedCSSDoc, expectedCSSDoc);
	});

	suiteTeardown(async () => {
		console.log('Disposing all resources');
		disposables.forEach((d: Disposable) => d.dispose());
	});
});

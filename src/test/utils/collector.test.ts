import assert from 'assert';

import { Collector } from '../../utils/collector';

import { atRulesDocument, mixedCssDocument, noneKeywordAsCssColorDocument } from "../sample/cssDocumentList";


suite('Collector Class', () => {

	test('initialize Collector class with no argument', () => {
		const classObject = new Collector();
		assert(classObject instanceof Collector);
		assert.equal(classObject.cssDocument, '');
	});

	test('initialize Collector class with css document', () => {

		const input = `
		body { 
			box-sizing: border-box;
		} 
		html {
			margin: 0;
			padding:0;
		}
		`;

		const classObject = new Collector(input);
		assert(classObject instanceof Collector);
		assert.equal(classObject.cssDocument, input);
		assert.deepEqual(classObject.colorMapper, new Map());
		assert.deepEqual(classObject.variableList, {});

	});

});

suite('selectorFinder method', () => {
	let input;
	let classObject: Collector;
	const mapper = new Map();
	let expectedMapper;

	test('should select all selector with their index', () => {
		input = `
		body { 
			box-sizing: border-box;
		} 
		html {
			margin: 0;
			padding:0;
		}
		`;
		classObject = new Collector(input);
		classObject.selectorFinder();
		mapper.set(8, 'body').set(50, 'html');
		assert.deepEqual(classObject.selectorMapper, mapper);
	});

	test('when media, keyframes and pseudo selector present in css file', () => {
		input = `
		body { 
			box-sizing: border-box;
		} 
		@media only screen and (max-width: 480px) {
			table {
				-webkit-text-fill-color: #567;
			}
		}
		@keyframes jump {
			0% {
				border-color: hwb(hue rgb(116, 59, 59) #854343);
			}
		}
		.other:has(nth-child(3)) {
			color: hsl(0, 100%, 50%);
			opacity: hsl(120, 100%, 50%);
			background-color: hsl(120, 75%, 75%);
		}		
		`;
		classObject = new Collector(input);
		classObject.selectorFinder();
		expectedMapper = new Map([
			[8, 'body'],
			[87, 'media'],
			[98, 'table'],
			[162, 'jump'],
			[170, 'unicodeSelector'],
			[261, 'other']
		]);
		assert.deepEqual(classObject.selectorMapper, expectedMapper);
	});

	test('when various At-rules and comments presented in the css file', () => {
		classObject = new Collector(atRulesDocument);
		classObject.selectorFinder();
		console.log(classObject.selectorMapper);
		const expectedMapper = new Map([
			[59, 'root'],
			[92, 'starSelector'],
			[148, 'scope'],
			[230, 'where'],
			[314, 'supports'],
			[363, 'summary'],
			[458, 'flash'],
			[465, 'unicodeSelector'],
			[528, 'unicodeSelector'],
			[650, 'h1'],
			[687, 'page'],
			[762, 'top'],
			[806, 'page'],
			[903, 'page']]);
		assert.deepEqual(classObject.selectorMapper, expectedMapper);
	});

});

suite('colorWithPropertyFinder method', () => {

	let input;
	let classObject: Collector;

	test('when there is no color in css file', async () => {
		input = `
		body { 
			box-sizing: border-box;
		} 
		html {
			margin: 0;
			padding:0;
		}
		`;
		classObject = new Collector(input);
		classObject.selectorFinder();
		classObject.colorWithPropertyFinder();
		assert.equal(classObject.colorMapper.size, 0);
	});

	test('when there are multiple color variation with duplicate colors in css file', async () => {
		classObject = new Collector(mixedCssDocument);
		classObject.selectorFinder();
		classObject.colorWithPropertyFinder();

		const expectedSelectorMapper = new Map([
			[6, "body"],
			[55, "main"],
			[119, "p"],
			[191, "a"],
			[304, "jump"],
			[311, 'unicodeSelector']
		]);
		assert.equal(classObject.selectorMapper.size, 6);
		assert.deepEqual(classObject.selectorMapper, expectedSelectorMapper);

		const expectedColorMapper = new Map([
			[[15, 19], "--body__txt--1"],
			[[40, 45], "--body__bg--2"],
			[[65, 72], "--body__txt--1"],
			[[100, 106], "--main__txt__fill--3"],
			[[140, 147], "--p__bg--4"],
			[[157, 178], "--p__txt--5"],
			[[223, 242], "--a__box__shadow--6"],
			[[259, 282], "--a__border--7"],
			[[331, 354], "--unicodeSelector__border--8"],
			[[376, 396], "--unicodeSelector__bg--9"]
		]);

		//console.log(classObject.colorMapper);
		assert.equal(classObject.colorMapper.size, 10);
		assert.deepEqual(classObject.colorMapper, expectedColorMapper);

		const expectedVariableList = {
			"--body__txt--1": "#fff",
			"--body__bg--2": "#123d",
			"--main__txt__fill--3": "purple",
			"--p__bg--4": "#112233",
			"--p__txt--5": "hwb(90 10% 10% / 0.5)",
			"--a__box__shadow--6": "rgba(0, 0, 255, .2)",
			"--a__border--7": "hsla(30, 100%, 50%, .1)",
			"--unicodeSelector__border--8": "hsl(270, 60%, 50%, 15%)",
			"--unicodeSelector__bg--9": "hwb(0.25turn 0% 40%)"
		};
		assert.equal(Object.keys(classObject.variableList).length, 9);
		assert.deepEqual(classObject.variableList, expectedVariableList);
	});

	test('when there are none keyword written as color value', async () => {
		classObject = new Collector(noneKeywordAsCssColorDocument);
		classObject.selectorFinder();
		classObject.colorWithPropertyFinder();

		const expectedVariableList = {
			"--body__bg--1": "rgb(102 none none / none)",
			"--body__bg--2": "rgba(40%, 20%, 60%, 100%)",
			"--body__bg--3": "hsl(  270deg none none   )",
			"--body__bg--4": "hsla(270deg none none 100)",
			"--body__bg--5": "hwb(0.75turn 20 40)",
			"--body__bg--6": "hwb(none 20% 40%)",
			"--body__bg--7": "lch(32.39 61.25 none)",
			"--body__bg--8": "oklch(0.44 0.16 303.38)",
			"--body__bg--9": "lab(32.39 38.43 -47.69 / none)",
			"--body__bg--10": "oklab(44% 0.09 -0.13)",
			"--body__bg--11": "hwb(0.75turn 20% 40%)",
			"--body__bg--12": "rgba(40%, 20%, 60% / 100%)",
			"--body__bg--13": "hwb(4.712rad none 40%)"
		};
		assert.equal(Object.keys(classObject.variableList).length, 13);
		assert.deepEqual(classObject.variableList, expectedVariableList);
	});

	suite('getRootPosition method', () => {

		let input;
		let classObject: Collector;

		test('when there is no import statement then root position is top of teh file', () => {
			input = `
		body { 
			box-sizing: border-box;
		} 
		html {
			margin: 0;
			padding:0;
		}
		`;
			classObject = new Collector(input);
			const position = classObject.locateImportPosition();
			assert.deepEqual(position, [0, 0]);
		});

		test('when there are import statement then root position is after import statements', () => {
			input = `
		@import url('base.css');
		@import url('core.css');
		body { 
			box-sizing: border-box;
		} 
		html {
			margin: 0;
			padding:0;
		}
		`;
			classObject = new Collector(input);
			const position = classObject.locateImportPosition();
			assert.deepEqual(position, [3, 0]);
		});

	});

	suite('skipRootProperty method', () => {
		let input: string;
		test('when no :root declaration block in css document', () => {
			input = `
				* {
					box-sizing: border-box;
				}
		`;
			const classObject = new Collector(input);
			classObject.skipImportAndRootPosition();
			assert.equal(classObject.skipParsingIndex, 0);
		});

		test('when there is :root declaration block on top of document', () => {
			const classObject = new Collector(input);
			input = `
				:root {
					--min: 16px;
				}
		`;
			classObject.skipImportAndRootPosition();
			assert.equal(classObject.skipParsingIndex, 0);
		});

		test('when there is :root declaration block in the document but not on top', () => {
			const classObject = new Collector(input);
			input = `
			import(url);
			:root {
				--min: 16px;
			}
		`;
			classObject.skipImportAndRootPosition();
			assert.equal(classObject.skipParsingIndex, 35);
		});

		test('when there is multiple :root declaration block in document', () => {
			const classObject = new Collector(input);
			input = `
				@media (prefers-color-scheme: dark) {
					:root {
						--accent-color: hsl(225, 31%, 96%);
						--background-color: hsl(0, 2%, 20%);
					}
				}

				@media (prefers-color-scheme: light) {
					:root {
						--accent-color: hsl(0, 0%, 0%);
						--background-color: hsl(0, 0%, 100%);
					}
				}
		`;
			classObject.skipImportAndRootPosition();
			assert.equal(classObject.skipParsingIndex, 48);
		});

	});

});
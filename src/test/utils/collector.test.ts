/* eslint-disable @typescript-eslint/naming-convention */
import * as assert from 'assert';

import { Collector } from '../../utils/collector';

import { atRulesDocument, mixedCssDocument } from "../sample/cssDocumentList";


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
	let mapper = new Map();
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
			[98, 'table'],
			[162, 'jump'],
			[261, 'other']
    ]);
		assert.deepEqual(classObject.selectorMapper, expectedMapper);
	});

	test('when various At-rules and comments presented in the css file', () => {
		classObject = new Collector(atRulesDocument);
		classObject.selectorFinder();
		const expectedMapper = new Map([
			[59, 'import'],
			[92, 'starSelector'],
			[148, 'scope'],
			[230, 'where'],
			[314, 'supports'],
			[458, 'flash'],
			[650, 'example'],
			[687, 'page'],
			[806, 'page'],
			[903, 'page']]);
		assert.deepEqual(classObject.selectorMapper, expectedMapper);
	});

});

suite('colorFinder method', () => {

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
		]);
		assert.equal(classObject.selectorMapper.size, 5);
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
			[[331, 354], "--jump__border--8"],
			[[376, 396], "--jump__bg--9"]
		]);
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
			"--jump__border--8": "hsl(270, 60%, 50%, 15%)",
			"--jump__bg--9": "hwb(0.25turn 0% 40%)"
		};
		assert.equal(Object.keys(classObject.variableList).length, 9);
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
			const position = classObject.getRootPosition();
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
			const position = classObject.getRootPosition();
			assert.deepEqual(position, [3, 0]);
		});

	});

});
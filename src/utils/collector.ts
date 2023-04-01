/*
	@author: Keshav Mohta

	This is main class which parse the css file
*/
import { ColorMap, HexString, RegExpMatchArrayWithIndices, SelectorMap, VariableList } from '../models/base';
import { checkDuplicateHexColor, checkDuplicateNonHexColor, combinedColorAndPropertyPattern, combinedColorPattern, getParentSelectorName, setVariableName } from './common';
import { PATTERN_LIST } from './constants';


export class Collector {
	cssDocument: string;
	rootSelectorEndingIndex: number; // where first `{` ends if :root defined in css file 
	#propertyName: string;
	#variableList: VariableList;
	#colorMapper: ColorMap;
	#selectorMapper: SelectorMap;
	#colorRegex: RegExp;
	#colorAndPropertyRegex: RegExp;
	#importRegex: RegExp;
	#selectorRegex: RegExp;
	#rootRegex: RegExp;
	#wordRegex: RegExp;

	constructor(document = '') {
		this.cssDocument = document;
		this.rootSelectorEndingIndex = 0;
		this.#propertyName = '';
		this.#variableList = {};
		this.#colorMapper = new Map();
		this.#selectorMapper = new Map();
		/* all regex initialized first */
		this.#colorRegex = new RegExp(combinedColorPattern, 'img');
		this.#colorAndPropertyRegex = new RegExp(combinedColorAndPropertyPattern, 'imgd');
		this.#importRegex = new RegExp(PATTERN_LIST.IMPORT_STMT, 'imgd');
		this.#selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
		this.#rootRegex = new RegExp(PATTERN_LIST.ROOT_SELECTOR, 'imgd');
		this.#wordRegex = new RegExp(PATTERN_LIST.WORD, 'imgu');
	}

	get colorMapper() {
		return this.#colorMapper;
	}

	get selectorMapper() {
		return this.#selectorMapper;
	}

	get variableList() {
		return this.#variableList;
	}

	*getBlockStartIndex(pos = 0) {
		const currentIndex = this.cssDocument.indexOf('{', pos);
		yield currentIndex;
	}

	/* check whether there are any color in css file except inside the :root selector; return true if color exist */
	verifyAnyColorExistInDocument() {
		this.skipImportAndRootPosition();
		this.#colorRegex.lastIndex = this.rootSelectorEndingIndex;
		const colorMatchResult = this.#colorRegex.exec(this.cssDocument); // note: here using .exec to get more control than .match
		return colorMatchResult !== null;
	}

	/* make sure we do not scan @import statement and existing :root block, so getting the index position of closing bracket of :root */
	skipImportAndRootPosition() {
		const rootMatchList = this.cssDocument.matchAll(this.#rootRegex);
		const lastRootBlock = Array.from(rootMatchList).pop();
		if (lastRootBlock) {
			const { indices: { groups } } = <RegExpMatchArrayWithIndices>lastRootBlock;
			const { ROOT_BLOCK } = groups;
			const [, lastIndex] = ROOT_BLOCK;
			const closingBlockIndex = this.cssDocument.indexOf('}', lastIndex);
			this.rootSelectorEndingIndex = closingBlockIndex !== -1 ? closingBlockIndex : 0;
		} else {
			const lastImportPosition = this.locateImportPosition(true) as number;
			this.rootSelectorEndingIndex = lastImportPosition;
		}
	}

	selectorFinder() {
		let selector = '';
		this.#selectorRegex.lastIndex = this.rootSelectorEndingIndex;
		const selectorMatchList = this.cssDocument.matchAll(this.#selectorRegex);
		for (const matchingSelector of selectorMatchList) {
			const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = <RegExpMatchArrayWithIndices>matchingSelector;
			const { SELECTOR: selectorName } = selectorGroup!;
			const { SELECTOR: selectorIndex } = selectorIndicesGroup;
			const [, lastIndex] = selectorIndex;
			let trimmedSelectorName = selectorName.trim();
			if (trimmedSelectorName === '*') { // special case
				selector = 'starSelector';
			}
			else {
				if (trimmedSelectorName.startsWith('@keyframes')) { // capture keyframe identifier 
					[, trimmedSelectorName] = trimmedSelectorName.split(' ');
				}
				const match = trimmedSelectorName.match(this.#wordRegex) as [string];
				selector = match ? match[0] : 'unicodeSelector';
			}
			this.#selectorMapper.set(lastIndex, selector);
		}
	};

	/* get color value and it's respective property */

	colorWithPropertyFinder() {
		let num = 0;
		let variableName = '';
		this.#colorAndPropertyRegex.lastIndex = this.rootSelectorEndingIndex;
		const colorAndPropertyMatchList = this.cssDocument.matchAll(this.#colorAndPropertyRegex);
		for (const matchingColorAndProperty of colorAndPropertyMatchList) {
			let isColorVariableExist = false;
			const { groups: colorAndPropertyGroup, indices: { groups: colorIndicesGroup } } = matchingColorAndProperty as RegExpMatchArrayWithIndices;
			const { PROPERTY, HEX_COLOR, NON_HEX_COLOR, COLOR_NAME, COLOR_FUNCTION } = colorAndPropertyGroup!;
			if (PROPERTY !== undefined) {
				this.#propertyName = PROPERTY;
			} else {
				const colorValue = HEX_COLOR || NON_HEX_COLOR || COLOR_NAME || COLOR_FUNCTION;
				if (HEX_COLOR) {
					[isColorVariableExist, variableName] = checkDuplicateHexColor(HEX_COLOR as HexString, this.#variableList);
				} else { // check for named, color, and other color format with same value
					[isColorVariableExist, variableName] = checkDuplicateNonHexColor(colorValue, this.#variableList);
				}
				const colorIndexList = colorIndicesGroup.HEX_COLOR || colorIndicesGroup.NON_HEX_COLOR || colorIndicesGroup.COLOR_NAME || colorIndicesGroup.COLOR_FUNCTION;
				const [start] = colorIndexList;
				if (!isColorVariableExist) {
					num++;
					const selectorName = getParentSelectorName(this.#selectorMapper, start);
					const propertyName = this.#propertyName;
					variableName = setVariableName({ selectorName, num, propertyName });
					Object.assign(this.#variableList, { [variableName]: colorValue.toLowerCase() });
				}
				this.#colorMapper.set(colorIndexList, variableName);
			}
		}
	}

	/* locate position of last import statement, after that new :root will be placed  
		@param boolean `toSKip` is true then we return the last index of import statement and so that we skip import statements while parsing
		otherwise execution of command for @import 'red.css' will change `red` into variable name.
	*/
	locateImportPosition(toSkip = false): number[] | number {
		const importMatchList = this.cssDocument.matchAll(this.#importRegex);
		const lastImportStatement = Array.from(importMatchList).pop();
		let position = [0, 0];
		let lastImportIndex = 0;
		if (lastImportStatement) {
			const { indices: { groups: { IMPORT: importGroup } } } = <RegExpMatchArrayWithIndices>lastImportStatement;
			lastImportIndex = importGroup[1];
			// find line number on last @import statement and place :root after that
			const line = this.cssDocument.substring(0, lastImportIndex);
			const totalLines = line.match(/\n/g)?.length ?? 0;
			position = [totalLines + 1, 0];
		}
		return toSkip ? lastImportIndex : position;
	};
}

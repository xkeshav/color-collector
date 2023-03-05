import { ColorMap, HexString, RegExpMatchArrayWithIndices, SelectorMap, VariableList } from '../models/base';
import { checkDuplicateHexColor, checkDuplicateNonHexColor, combinedColorAndPropertyPattern, combinedColorPattern, getParentSelectorName, setVariableName } from './common';
import { PATTERN_LIST } from './constants';


export class Collector {

	cssDocument: string;
	rootSelectorEndingIndex: number;
	#variableList: VariableList;
	#selectorMapper: SelectorMap;
	#colorMapper: ColorMap;
	#selectorRegex: RegExp;
	#wordRegex: RegExp;
	#importRegex: RegExp;
	#colorRegex: RegExp;
	#colorAndPropertyRegex: RegExp;
	#propertyName: string;
	#rootRegex: RegExp;

	constructor(document = '') {
		this.cssDocument = document;
		this.#selectorMapper = new Map();
		this.#colorMapper = new Map();
		this.#variableList = {};
		this.#propertyName = '';
		this.rootSelectorEndingIndex = 0; // where first `{` ends if :root defined in css file 
		/* all regex initialized first */
		this.#wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
		this.#colorRegex = new RegExp(combinedColorPattern, 'img');
		this.#selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
		this.#importRegex = new RegExp(PATTERN_LIST.IMPORT_STMT, 'imgd');
		this.#rootRegex = new RegExp(PATTERN_LIST.ROOT_SELECTOR, 'imgd');
		this.#colorAndPropertyRegex = new RegExp(combinedColorAndPropertyPattern, 'imgd');
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

	/* check whether there are any color in css file except inside the :root selector; return true if color exist */
	verifyColorExistInDocument() {
		this.skipRootDeclarationBlock();
		this.#colorRegex.lastIndex = this.rootSelectorEndingIndex;
		const colorMatchResult = this.#colorRegex.exec(this.cssDocument); // note: here using .exec to get more control than .match
		return colorMatchResult !== null;
	}

	/* make sure we do not scan in :root block, so getting the index position of closing bracket of :root */
	skipRootDeclarationBlock() {
		const rootMatchList = this.cssDocument.matchAll(this.#rootRegex);
		const lastRootBlock = Array.from(rootMatchList).pop();
		if (lastRootBlock) {
			const { indices: { groups } } = <RegExpMatchArrayWithIndices>lastRootBlock;
			const { ROOT_BLOCK } = groups;
			const [, lastIndex] = ROOT_BLOCK;
			const closingBlockIndex = this.cssDocument.indexOf('}', lastIndex);
			this.rootSelectorEndingIndex = closingBlockIndex !== -1 ? closingBlockIndex : 0;
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
				const [firstMatch] = trimmedSelectorName.match(this.#wordRegex) as [string];
				selector = firstMatch;
			}
			this.#selectorMapper.set(lastIndex, selector);
		}
	};

	/* get color value and it's respective property */

	colorWithPropertyFinder() {
		let num = 0;
		let variableName = '';
		this.#colorAndPropertyRegex.lastIndex = this.rootSelectorEndingIndex;
		const colorMatchList = this.cssDocument.matchAll(this.#colorAndPropertyRegex);
		for (const matchingColor of colorMatchList) {
			let isColorVariableExist = false;
			const { groups: colorGroup, indices: { groups: colorIndicesGroup } } = matchingColor as RegExpMatchArrayWithIndices;
			const { PROPERTY, HEX_COLOR, NON_HEX_COLOR, COLOR_NAME } = colorGroup!;
			if (PROPERTY !== undefined) {
				this.#propertyName = PROPERTY;
			} else {
				const colorValue = HEX_COLOR || NON_HEX_COLOR || COLOR_NAME;
				if (HEX_COLOR) {
					[isColorVariableExist, variableName] = checkDuplicateHexColor(HEX_COLOR as HexString, this.#variableList);
				} else {
					[isColorVariableExist, variableName] = checkDuplicateNonHexColor(colorValue, this.#variableList);
				}
				const colorIndexList = colorIndicesGroup.HEX_COLOR || colorIndicesGroup.NON_HEX_COLOR || colorIndicesGroup.COLOR_NAME;
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

	locateRootPosition(): number[] {
		const importMatchList = this.cssDocument.matchAll(this.#importRegex);
		const importMatchDetails = [...importMatchList];
		let position = [0, 0];
		if (importMatchDetails.length) {
			const lastImportStatement = importMatchDetails.pop() as RegExpMatchArrayWithIndices;;
			const { indices: { groups: { IMPORT: importGroup } } } = lastImportStatement;
			const [, last] = importGroup;
			// find line number on last @import statement and place :root after that
			const line = this.cssDocument.substring(0, last);
			const totalLines = line.match(/\n/g)?.length ?? 0;
			position = [totalLines + 1, 0];
		}
		return position;
	};
}
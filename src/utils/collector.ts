import { ColorMap, HexString, RegExpMatchArrayWithIndices, SelectorMap, VariableList } from '../models/base';
import { checkDuplicateHexColor, checkDuplicateNonHexColor, combinedColorAndPropertyPattern, combinedColorPattern, getParentSelectorName, setVariableName } from './common';
import { PATTERN_LIST } from './constants';


export class Collector {

	cssDocument: string;
	#rootSelectorClosingIndex: number;
	#variableList: VariableList;
	#selectorMapper: SelectorMap;
	#colorMapper: ColorMap;
	#selectorRegex: RegExp;
	#wordRegex: RegExp;
	#importRegex: RegExp;
	#colorRegex: RegExp;
	#colorAndPropertyRegex: RegExp;
	#propertyName;

	constructor(document = '') {
		this.cssDocument = document;
		this.#selectorMapper = new Map();
		this.#colorMapper = new Map();
		this.#variableList = {};
		this.#propertyName = '';
		this.#rootSelectorClosingIndex = 0;
		/* all regex initialized first */
		this.#wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
		this.#colorRegex = new RegExp(combinedColorPattern, 'img');
		this.#selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
		this.#importRegex = new RegExp(PATTERN_LIST.IMPORT_STMT, 'imgd');
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

	/* check whether there are any color in css file except inside the :root selector */
	hasAnyColorExist() {
		this.#colorRegex.lastIndex = this.#rootSelectorClosingIndex;
		const colorMatchResult = this.#colorRegex.exec(this.cssDocument); // note: here using .exec to get more control than .match
		return colorMatchResult !== null;
	}

	/* make sure we do not check in :root selector , so getting the index position of closing bracket of :root */
	escapeRootProperty() {
		const startIndex = this.cssDocument.lastIndexOf(':root');
		const endIndex = this.cssDocument.indexOf('}', startIndex);
		this.#rootSelectorClosingIndex = endIndex;
	}

	selectorFinder() {
		let selector = '';
		this.#selectorRegex.lastIndex = this.#rootSelectorClosingIndex;
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
		this.#colorAndPropertyRegex.lastIndex = this.#rootSelectorClosingIndex;
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

	getRootPosition(): number[] {
		const importMatchList = this.cssDocument.matchAll(this.#importRegex);
		const importMatchDetails = [...importMatchList];
		let position = [0, 0];
		if (importMatchDetails.length) {
			const lastImportStatement = importMatchDetails.pop() as RegExpMatchArrayWithIndices;;
			const { input, index } = lastImportStatement;
			// find line number on last @import statement and place :root after that
			const line = (input as any).substr(0, index).match(/\n/g).length + 1;
			position = [line, 0];
		}
		return position;
	};
}
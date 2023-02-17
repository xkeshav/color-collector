import { ColorMap, HexString, RegExpMatchArrayWithIndices, SelectorMap, VariableList } from '../models/base';
import { checkDuplicateHexColor, checkDuplicateNonHexColor, combinedColorPattern, getParentSelectorName, setVariableName } from './common';
import { PATTERN_LIST } from './constants';


export class Collector {

	cssDocument: string;

	#variableList: VariableList;
	#selectorMapper: SelectorMap;
	#colorMapper: ColorMap;
	
	#selectorRegex: RegExp;
	#wordRegex: RegExp;
	#importRegex: RegExp;
	#colorRegex: RegExp;
	#propertyName;

	constructor(document = '') {
		this.cssDocument = document;
		this.#selectorMapper = new Map();
		this.#colorMapper = new Map();
		this.#variableList = {};
		this.#propertyName = '';
		/* all regex initialized first */
		this.#wordRegex = new RegExp(PATTERN_LIST.WORD, 'img');
		this.#selectorRegex = new RegExp(PATTERN_LIST.SELECTOR_WITH_MEDIA, 'imgd');
		this.#importRegex = new RegExp(PATTERN_LIST.IMPORT_STMT, 'imgd');
		this.#colorRegex = new RegExp(combinedColorPattern, 'imgd');
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

	public selectorFinder() {
		let selector = '';
		const selectorMatchList = this.cssDocument.matchAll(this.#selectorRegex);
		for (const matchingSelector of selectorMatchList) {
			const { groups: selectorGroup, indices: { groups: selectorIndicesGroup } } = <RegExpMatchArrayWithIndices>matchingSelector;
			const { SELECTOR: selectorName } = selectorGroup!;
			const { SELECTOR: selectorIndex } = selectorIndicesGroup;
			const [, lastIndex] = selectorIndex;
			let trimmedSelectorName = selectorName.trim();
			//console.log({trimmedSelectorName});
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
			//console.log({ selector });
			this.#selectorMapper.set(lastIndex, selector);
		}
	};

	public colorFinder() {
		let num = 0;
		let variableName = '';
		const colorMatchList = this.cssDocument.matchAll(this.#colorRegex);
		for (const matchingColor of colorMatchList) {
			//console.log({matchingColor});
			let isColorVariableExist = false;
			const { groups: colorGroup, indices: { groups: indicesGroup } } = matchingColor as RegExpMatchArrayWithIndices;
			const { PROPERTY, HEX_COLOR, NON_HEX_COLOR, COLOR_NAME } = colorGroup!;
			if (PROPERTY !== undefined) {
				this.#propertyName = PROPERTY;
			} else {
				const colorValue = HEX_COLOR || NON_HEX_COLOR || COLOR_NAME;
				//console.log({colorValue});
				if (HEX_COLOR) {
					[isColorVariableExist, variableName] = checkDuplicateHexColor(HEX_COLOR as HexString, this.#variableList);
				}
				else {
					[isColorVariableExist, variableName] = checkDuplicateNonHexColor(colorValue, this.#variableList);
				}
				//console.log({variableName, isColorVariableExist});
				const colorIndexList = indicesGroup.HEX_COLOR || indicesGroup.NON_HEX_COLOR || indicesGroup.COLOR_NAME;
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

	public getRootPosition(): number[] {
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
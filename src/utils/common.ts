import { FnVariableNameType, SelectorMap, VariableList } from '../models/base';
import { PATTERN_LIST, PROPERTY_ALIAS_MAPPER } from './constants';

const regexPatterns = [
	PATTERN_LIST.PROPERTY,
	PATTERN_LIST.COLOR_HEX_FORMAT,
	PATTERN_LIST.COLOR_NON_HEX_FORMAT
];

;

export const combinedPattern = regexPatterns.map((rx) => rx).join('|');

export const createRootSelector = (list: VariableList) => {
	const op = Object.entries(list).reduce((p, [k, v]) => p += `${k}: ${v};\n`, ``);
	return `:root { \r\n${op}}`;
};

export const getParentSelectorName = (selectorList:SelectorMap, start: number) => {
	const selectorPositionIndex = Array.from(selectorList.keys());
	const selectorKey = (selectorPositionIndex as any).findLast((sl: number) => sl < start);
	const selectorName = selectorList.get(selectorKey) ?? 'thisBlock'; // default selector name if not found
	return selectorName;
};

export const setVariableName =  ({ hexCode, nonHexCode, selectorName, previousProperty, num, variableList }: FnVariableNameType) =>  {
	const variableValue = hexCode || nonHexCode;
	const element = PROPERTY_ALIAS_MAPPER.get(previousProperty) ?? 'thisElement';
	const variableName = `--${selectorName}__${element}--${num}`;
	Object.assign(variableList, { [variableName]: variableValue });
	return variableName;
};
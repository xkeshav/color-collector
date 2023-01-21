import { VariableList } from '../models/base';
import { PATTERN_LIST } from './constants';

const regexPatterns = [
	PATTERN_LIST.COLOR_HEX_FORMAT,
	PATTERN_LIST.COLOR_NON_HEX_FORMAT
];

export const combinedPattern = regexPatterns.map((rx) => rx).join('|');

export const createRootSelector = (list: VariableList) => {
	const op = Object.entries(list).reduce((p, [k, v]) => p += `${k}: ${v};\n`, ``);
	return `:root { \r\n${op}}`;
};
import { SelectorMap, VariableList, VariableNameParameter } from '../models/base';
import { PATTERN_LIST, PROPERTY_ALIAS_MAPPER } from './constants';

const regexPatterns = [
	PATTERN_LIST.PROPERTY,
	PATTERN_LIST.COLOR_HEX_FORMAT,
	PATTERN_LIST.COLOR_NON_HEX_FORMAT
];


export const combinedPattern = regexPatterns.map((rx) => rx).join('|');

export const createRootSelector = (list: VariableList) => {
	const op = Object.entries(list).reduce((p, [k, v]) => p += `${k}: ${v};\n`, ``);
	return `:root { \r\n${op}}`;
};

/* find the parent selector name, in which we capture the color so that we can assign this parent selector name to identify */

export const getParentSelectorName = (selectorList: SelectorMap, start: number) => {
	const selectorPositionIndex = Array.from(selectorList.keys());
	const selectorKey = (selectorPositionIndex as any).findLast((sl: number) => sl < start);
	const selectorName = selectorList.get(selectorKey) ?? 'thisBlock'; // default selector name if not found
	return selectorName;
};

export const setVariableName = ({ selectorName, propertyName, num }: VariableNameParameter): keyof VariableList => {
	const property = PROPERTY_ALIAS_MAPPER.get(propertyName) ?? 'thisElement'; // default element name if not found
	return `--${selectorName}__${property}--${num}`;
};

/* check all color variation for given hex value */
export const hexColorVariation = (value: string) => {
  const cv = value.slice(1);
  const initial =  [value];
	let output: string[] = [];
  if (cv.length === 3) {
    const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '#');
    initial.push(longHexValue, longHexValue + 'ff');
  }
  if (cv.length === 4) {
    const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '#');
    if(cv[3] === 'f') {
      const shortHexValue = '#' + longHexValue.slice(2);
      initial.push(shortHexValue, longHexValue);
    }
    else { 
      initial.push(longHexValue);
    }
  }
  if (cv.length === 6) {
    const longHexValue  = '#' + cv + 'ff';
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5]) {
      const shortHexValue = `#${cv[1]}${cv[3]}${cv[5]}`;
      initial.push(shortHexValue, longHexValue);
    } else {
      initial.push(longHexValue);
    }
  }
  if (cv.length === 8) {
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5] && cv[6] === cv[7]) {
      const shortHexValue = `#${cv[1]}${cv[3]}${cv[5]}${cv[7] !== 'f' ? cv[7] : ''}`;
      initial.push(shortHexValue);
    }
  }
	return output.concat(initial);
};
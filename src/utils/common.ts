import { HexString, SelectorMap, VariableList, VariableNameParameter } from '../models/base';
import { PATTERN_LIST, PROPERTY_ALIAS_MAPPER } from './constants';

const colorPatterns = [
	PATTERN_LIST.PROPERTY,
	PATTERN_LIST.COLOR_HEX_FORMAT,
	PATTERN_LIST.COLOR_NON_HEX_FORMAT,
  PATTERN_LIST.COLOR_NAME
];


export const combinedColorPattern = colorPatterns.map((rx) => rx).join('|');

export const createRootSelector = (list: VariableList) => {
	const op = Object.entries(list).reduce((p, [k, v]) => p += `\t${k}: ${v};\n`, ``);
	return `:root { \r\n${op}}\n`;
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

/* check all color variation for a given hex value 
  #fff === #ffff === #ffffff === #ffffffff
  #abcd === #aabbccdd
  #abcf === #abc === #aabbcc === #aabbccff
  #aabbcc === #abc === #abcf === #aabbccff
  #aabb2233 === #ab23
*/
export const hexColorVariation = (value: HexString): HexString[] => {
  const cv = value.slice(1); // remove # from start
  const initial = [cv];
  if (cv.length === 3) {
    const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '');
    initial.push( cv + 'f', longHexValue, longHexValue + 'ff');
  }
  if (cv.length === 4) {
    const longHexValue = [...cv].reduce((p, n) => p.concat(n.repeat(2)), '');
    if(cv.endsWith('f')) {
      const shortHexValue = longHexValue.slice(0, -2);
      initial.push(cv.slice(0, -1), shortHexValue,  longHexValue);
    }
    else { 
      initial.push(longHexValue);
    }
  }
  if (cv.length === 6) {
    const longHexValue  = cv + 'ff';
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5]) {
      const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}`;
      initial.push(shortHexValue, shortHexValue + 'f', longHexValue );
    } else {
      initial.push(longHexValue);
    }
  }
  if (cv.length === 8) {
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5] && cv[6] === cv[7]) {
      const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}${cv[7] === 'f' ? '' : cv[7] }`;
      initial.push(shortHexValue, shortHexValue + 'f');
    }
    if(cv.endsWith('ff')) {
      initial.push(cv.slice(0,-2));
    }
  }
  return initial.map( i => `#${i}`) as HexString[];
};

// check all variation of a hex value
export const checkDuplicateHexColor = (colorValue: HexString, list: VariableList): [boolean, string]=>  {
  let isDuplicateColor = false;
  let colorVariable = '';
  const hexVariationList = hexColorVariation(colorValue) as string[];
  const hexColorEntry = Object.entries(list).find(([_, vv]) => hexVariationList.includes(vv));
  if (hexColorEntry !== undefined) {
    [colorVariable] = hexColorEntry;
    isDuplicateColor = true;
  }
  return [isDuplicateColor, colorVariable];
};

/* check all non hex color value whether it is named color or in other format */
export const checkDuplicateNonHexColor = (colorValue: string, list: VariableList): [boolean, string]=> {
  let isDuplicateColor = false;
  let colorVariable = '';
  const nonHexColorEntry = Object.entries(list).find(([_, vv]) => colorValue === vv);
  if (nonHexColorEntry !== undefined) {
    [colorVariable] = nonHexColorEntry;
    isDuplicateColor = true;
  }
  return [isDuplicateColor, colorVariable];
};
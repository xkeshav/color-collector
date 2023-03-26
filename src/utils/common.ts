import { HexString, SelectorMap, VariableList, VariableNameParams } from '../models/base';
import { PATTERN_LIST, PROPERTY_ALIAS_MAPPER } from './constants';

const colorPatterns = [
  PATTERN_LIST.COLOR_HEX_FORMAT,
  PATTERN_LIST.COLOR_NON_HEX_FORMAT,
  PATTERN_LIST.COLOR_NAME,
  PATTERN_LIST.COLOR_FUNCTION,
  PATTERN_LIST.PROPERTY, /* keep this as last element of array */
];


export const combinedColorAndPropertyPattern = colorPatterns.map((rx: string) => rx).filter(Boolean).join('|');

export const combinedColorPattern = colorPatterns.slice(0, -1).map((rx: string) => rx).filter(Boolean).join('|');

export const createRootContent = (list: VariableList) => {
  const content = Object.entries(list).reduce((p: string, [k, v]: [string, string]) => p += `\n\t${k}: ${v};`, ``);
  return `:root {${content}\n}\n`;
};

/* find the parent selector name, in which we capture the color so that we can assign this parent selector name to identify */

export const getParentSelectorName = (selectorList: SelectorMap, start: number) => {
  const selectorPositionIndex = Array.from(selectorList.keys());
  const selectorKey: number = (selectorPositionIndex as any).findLast((index: number) => index < start);
  const selectorName: string = selectorList.get(selectorKey) ?? 'defaultSelector';
  return selectorName;
};

export const setVariableName = ({ selectorName, propertyName, num }: VariableNameParams): keyof VariableList => {
  const property = PROPERTY_ALIAS_MAPPER.get(propertyName) ?? 'defaultElement'; // default element name if not found
  return `--${selectorName}__${property}--${num}`;
};

/* check all color variation for a given hex value 
  for example below are same color code with different variation
  #fff === #ffff === #ffffff === #ffffffff
  #abcd === #aabbccdd
  #abcf === #abc === #aabbcc === #aabbccff
  #aabbcc === #abc === #abcf === #aabbccff
  #aabb2233 === #ab23

  @return array of all hex color variation 
*/
export const hexColorVariation = (value: HexString): HexString[] => {
  const cv = value.slice(1); // remove # from start
  const hexColorList = [cv];
  if (cv.length === 3) {
    const longHexValue = [...cv].reduce((p: string, n: string) => p.concat(n.repeat(2)), '');
    hexColorList.push(cv + 'f', longHexValue, longHexValue + 'ff');
  }
  if (cv.length === 4) {
    const longHexValue = [...cv].reduce((p: string, n: string) => p.concat(n.repeat(2)), '');
    if (cv.endsWith('f')) {
      const shortHexValue = longHexValue.slice(0, -2);
      hexColorList.push(cv.slice(0, -1), shortHexValue, longHexValue);
    }
    else {
      hexColorList.push(longHexValue);
    }
  }
  if (cv.length === 6) {
    const longHexValue = cv + 'ff';
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5]) {
      const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}`;
      hexColorList.push(shortHexValue, shortHexValue + 'f', longHexValue);
    } else {
      hexColorList.push(longHexValue);
    }
  }
  if (cv.length === 8) {
    if (cv[0] === cv[1] && cv[2] === cv[3] && cv[4] === cv[5] && cv[6] === cv[7]) {
      const shortHexValue = `${cv[1]}${cv[3]}${cv[5]}${cv[7] === 'f' ? '' : cv[7]}`;
      hexColorList.push(shortHexValue, shortHexValue + 'f');
    }
    if (cv.endsWith('ff')) {
      hexColorList.push(cv.slice(0, -2));
    }
  }
  return hexColorList.map((c: string) => `#${c}`) as HexString[];
};

// check all variation of a hex value
export const checkDuplicateHexColor = (colorValue: HexString, list: VariableList): [boolean, string] => {
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
export const checkDuplicateNonHexColor = (colorValue: string, list: VariableList): [boolean, string] => {
  let isDuplicateColor = false;
  let colorVariable = '';
  const nonHexColorEntry = Object.entries(list).find(([_, vv]) => colorValue.toLowerCase() === vv);
  if (nonHexColorEntry !== undefined) {
    [colorVariable] = nonHexColorEntry;
    isDuplicateColor = true;
  }
  return [isDuplicateColor, colorVariable];
};


export const notFoundInFile = (prop: string, fileName: string = '') => `no color ${prop} found in the file ${fileName} !`;

export const successInfo = (fileName: string) => `color collection done successfully for ${fileName} !`;

export const importFileComment = (fileName: string) => `/* 
variables created by css color collector 
and import statement added in the respective css file
name: ${fileName}
date: ${new Date().toISOString()}
*/`;
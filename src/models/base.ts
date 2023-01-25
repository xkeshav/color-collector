export type VariableList = {
	[key: string]: string
};

export type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: Array<[number, number]> & { groups: { [key: string]: [number, number] } } };

export type SelectorMap = Map<number, string>;

export type FnVariableNameType = {
	hexCode: string;
	nonHexCode: string;
	selectorName: string;
	previousProperty: string;
	num: number;
	variableList: VariableList;
};
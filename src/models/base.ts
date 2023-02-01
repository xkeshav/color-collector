
export type VariableList = {
	[key: `--${string}`]: string
};

export type HexString = `#${string}`;

export type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: Array<[number, number]> & { groups: { [key: string]: [number, number] } } };

export type SelectorMap = Map<number, string>;

export type VariableNameParams = {
	selectorName: string;
	propertyName: string;
	num: number;
};
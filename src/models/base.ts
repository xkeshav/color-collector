
export type VariableList = {
	[key: `--${string}`]: string
};

export type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: Array<[number, number]> & { groups: { [key: string]: [number, number] } } };

export type SelectorMap = Map<number, string>;

export type VariableNameParameter = {
	selectorName: string;
	propertyName: string;
	num: number;
};
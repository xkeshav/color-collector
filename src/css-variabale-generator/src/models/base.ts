export type VariableList = {
	[key: string]: string
};

export type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: Array<[number, number]> & { groups: { [key: string]: [number, number] } } };
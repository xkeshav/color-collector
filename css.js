const variableList = {
  "--var-1": "#111",
  "--var-2": "#222",
  "--var-3": "#333"
};

const op = Object.entries(variableList).reduce((p, [k,v], i) => {
 return p += i = 0 ? `{ ${k}: ${v}; }` :  `${k}: ${v};` + `\n`;
}, '' );

const createRootSelector = (variableList) => {
    const op = Object.entries(variableList).reduce((p, [k, v]) => p +=`\t${k}: ${v};\n`, ``);
    return `:root {\r\n${op}}`;
};

console.log({op});

console.log(createRootSelector(variableList));

const str = `
this one
that one
`;


const rx = new RegExp('\\b(one)\\b', 'img');

const matches = str.matchAll(rx);

// for ( const match of matches) {
//   console.log({match});
// }
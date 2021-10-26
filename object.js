const getTrimmedObject = (obj) => {
  const trimmerObject = {};
  if (typeof obj === 'object') {
    for (const k in obj) {
      const own = Object.hasOwnProperty.call(obj, k);
      if (own) {
        const to = { [k.trim()]: obj[k].trim() };
        Object.assign(trimmerObject, to);
      }
    }
  }
  console.log({ trimmerObject });
  return trimmerObject;
};

const params = { a: '  Apple ', keys: ' keys', size: 'size  ', c: 'ca  t ' };

getTrimmedObject(params);

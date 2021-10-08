const  user1 = {name: 'john', age: 23, address: {street: 'first road', city: 'Pune'}, gender: {sex: 'male'}};
const  user2 = {name: 'lisa', age: 25, address: {street: 'lisa road', state: 'Maharashtra'}};

const deepMerge = (source, target) => {
  for(const [key, val] of Object.entries(source)) {
    if(val !== null && typeof val === 'object') {
      if(target[key] === undefined) {
        target[key] = {...val}
      }
      deepMerge(val, target[key]);
    } else {
      target[key] = val;
    }
  }
  return target;
};

const d_merge = (s,t) => {
  const res = {...s, ...t};
  // console.log({res});
  const keys = Object.keys(res);
  for(const key of keys) {
    const t_prop = t[key];
    const s_prop = s[key];
    // console.log({t_prop, s_prop});
    // if 2 object have conflicts
    if(typeof(t_prop) === 'object' && typeof(s_prop) === 'object') {
      res[key] = d_merge(s_prop, t_prop);
    }
  }
  return res;
}

const mergedObject = deepMerge(user1, user2);
console.log({mergedObject})

const mergedItem = d_merge(user1, user2);
console.log({mergedItem});
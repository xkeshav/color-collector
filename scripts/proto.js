const { log } = console;
const laptop = {
  name: 'dell',
  os: 'windows',
};

const desktop = {
  build: 2021,
};

//log(laptop.__proto__); //exist
// log(laptop.prototype); // undefined

// now if we want to access one object property via another then it access using __proto__

Object.setPrototypeOf(laptop, desktop);

// log(laptop.__proto__);// will have the property and it returns {build: 2021};
// log(laptop.build);// 2021
// log({laptop});// will not have `build` property
// log(laptop.propertyIsEnumerable('build'));// return false
// log(laptop.hasOwnProperty('build'));// return undefined

/**** prototype only exist with new keyword or in a****/

function Gadget(name, make) {
  this.name = name;
  this.make = make;
}

const gadget1 = new Gadget('dell', 'aspiron');

const gadget2 = { os: 'windows' };

log(gadget1.__proto__);
log(gadget1.prototype);

Object.setPrototypeOf(gadget1, gadget2);

log(gadget1.os);

const gadget3 = new Gadget('dell', 'vostro');

const gadget4 = { build: '2021' };

Object.setPrototypeOf(Gadget, gadget4); // note here we set property on function

log(gadget3.constructor.ram);

log(gadget3.hasOwnProperty('prototype'));
log(gadget3.constructor.hasOwnProperty('prototype'));

function  base (v) {
  const next =  function () {
    return v.toUpperCase();
  }
  return next;
}


const baseFn = base('hello');

baseFn();

try {
  fetch(`apicall`);
} catch(e) {

}
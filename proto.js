function base(v) {
  const next = function () {
    return v.toUpperCase();
  };
  return next;
}

const baseFn = base('hello');

baseFn();

try {
  fetch(`api call`);
} catch (e) {}

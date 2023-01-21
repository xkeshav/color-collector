const list = document.querySelectorAll('li');
const positionElement = document.querySelector('#positionElement');

/* higher order function */
const throttle = (fn, delay) => {
  let inThrottle;
  let lastFn = null;

  return (...args) => {
    if (inThrottle) {
      return;
    }
    console.log('%c throttle called', `color: khaki; font-size: medium`);
    inThrottle = true;
    fn(...args); // call function with arguments
    clearTimeout(lastFn);
    lastFn = setTimeout(() => {
      inThrottle = false;
    }, delay);
  };
};

const logMousePosition = (e) => {
  const { clientX, clientY } = e;
  const currentTime = new Date().toUTCString();
  positionElement.innerHTML = `
			X: ${clientX}
			Y: ${clientY}
			Time: ${currentTime}
			`;
};

const tellTime = (date) => {
  console.log('tell time', date.getTime());
};
// why method being called after every 2 ms while throttle time is 3 ms
setInterval(function () {
  throttle(tellTime(new Date()), 3000);
}, 2000);

const nav = document.querySelector('nav');
nav.addEventListener('mousemove', throttle(logMousePosition, 3000));

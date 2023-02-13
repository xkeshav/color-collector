
/* special test for at rules, and pseudo selectors */

export const input: string = `
@import url('base.css');
@import url('other.css');

:root {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
  outline: none;
}

:scope {
  background-color: #00ff00;
}

:where(ol, ul, menu:unsupported) :where(ol, ul) {
  color: #008000;
}

@supports (text-stroke: 10px) or (-webkit-text-stroke: 10px) {
  :is(:nth-child(2n + 1) a, details > summary) {
    -webkit-text-fill-color: #567;
    -webkit-text-stroke: #d2691e;
  }
}

@keyframes flash {
  0% {
    border-color: hwb(hue rgb(116, 59, 59) #666);
  }

  50% {
    background-color: hwb(hue rgb(116, 59, 59) #777);
  }
}

@namespace example url(http://www.example.com);
example|h1 {
  color: rgb(0, 255, 98);
}

@page {
  size: landscape;
  margin: 20%;
  background-color: #1a10;
  @top-left {
    border-color: red;
  }
}

@page :left {
  margin-top: 4in;
  border-bottom: #6ff;
}

/* Targets all odd-numbered pages */
@page :right {
  size: 11in;
  margin-top: 4in;
  color: #456;
}`;


export const colorVariationDocument: string = `
body {
	color:#fff;
	background-color: #123d;
}

main {
	color: #ffffff;
	-webkit-text-fill-color: PURPLE;
}

p:hover {
	background-color: #112233;
	color: hwb(90 10% 10% / 0.5)
}

a::after {
  content: '--';
  box-shadow:rgba(0, 0, 255, .2);
  border-color:hsla(30, 100%, 50%, .1);
}


@keyframes jump {
  0% {
    border-color: hsl(270, 60%, 50%, 15%);
		background-color: hwb(0.25turn 0% 40%);
  }
}`;

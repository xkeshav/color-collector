
/* special test for at rules, and pseudo selectors */

const atRulesDocument: string = `
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


const mixedCssDocument: string = `
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


const colorVariationDocument = {
  sample: `
        body {
          background-color: #1a10;
          color: #2a324f;
        }

        main {
          color: #334455ff;
        }

        .class {
          border-color: #6ff;
        }

        .more {
          color: rgb(255, 0, 153);
          color: rgb(255, 0, 0 / 1);
          color: rgb(98.08%, 0%, 53.78%);
          color: rgb(300, 0, 0);
          color: rgb(100 10 1 / 0.1);
          color: rgb(255, -10, 0);
          color: rgba(255, 0, 0, 1);
          color: rgba(100%, 0%, 0%, 1);
          color: rgba(0, 0, 255, 0.5);
          color: rgba(100%, 50%, 0%, 0.1);
          color: hsl(0, 100%, 50%);
          color: hsl(0deg 100% 50% / 0.5);
          color: hsl(12rad 100% 25%);
          color: hsl(0.5turn, 50%, 50%);
          color: hsl(120 75% 75%);
          color: hsla(120, 100%, 50%, 1);
          color: hsla(240, 100%, 50%, 0.5);
          color: hsla(30, 100%, 50%, 0.1);
          color: hwb(0.25turn 0% 40%);
          color: hwb(1.5708rad 60% 0%);
          color: hwb(90 10% 10%);
          color: hwb(90 10% 10% / 0.5);
          color: hwb(90 10% 10% / 50%);
          background-color: lch(50% 100 0);
          background-color: lch(80% 240 50 / 0.5);
          background-color: lch(29.69% 45.553% 327.1);
          caret-color: lab(80% 100 50);
          caret-color: lab(51.2345% -13.6271 16.2401);
          caret-color: lab(29.69% 44.888% -29.04%);
          border-color: oklab(59.69% 0.1007 0.1191);
          border-color: oklab(59.69% 0.1007 0.1191 / 0.5);
          border-color: oklab(42.1% 41% -25%);
          border-color: oklab(72.322% -0.0465 -0.1150);
          background: oklch(0.65125 0.13138 104.097);
          background: oklch(45% 0.26 264);
          background: oklch(100% 0 0);
          background: oklch(0% 0 0 / 50%);
          background-color: color(display-p3 1 0 0);
          background-color: color(rec2020 0.42210 0.47580 0.35605);
          background-color: color(prophoto-rgb 0.88 0.45 0.10);
          background-color: color(a98-rgb 0.44091 0.49971 0.37408);
          background-color: color(sRGB 0.41587 0.503670 0.36664);
        }
    `,
};

const noneKeywordAsCssColorDocument = `
body {
  background-color: linear-gradient(to bottom, 
  rgb(102 none none / none),
  rgba(40%, 20%, 60%, 100%),
  hsl(  270deg none none   ),
  hsla(270deg none none 100),
  hwb(0.75turn 20 40)),
  hwb(none 20% 40%),
  lch(32.39 61.25 none),
  oklch(0.44 0.16 303.38),
  lab(32.39 38.43 -47.69 / none),
  oklab(44% 0.09 -0.13),
  hwb(0.75turn 20% 40%)
  rgba(40%, 20%, 60% / 100%),
  hwb(4.712rad none 40%);
}`;

export { atRulesDocument, mixedCssDocument, colorVariationDocument, noneKeywordAsCssColorDocument };


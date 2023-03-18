# css-color-collector

A simple vs code extension that works with _.css_ files and assigns all colors into the css variables.

## Description

In an open CSS file, this extension parse file for all color values and collect the color value and assign into an descriptive variable for every different color and include all these variables in a `:root` pseudo-class at the very top, also replace the color values in file with these new variable name.

## Use Case

This approach has a few benefits. First, it can help make your code more readable by giving names to colors that might otherwise be difficult to remember. Second, it can help you avoid duplicating colors throughout your code. And third, if you ever need to change a color value, you can do so in one place and have the change propagate throughout your entire stylesheet.

## Install

- Open Extensions sideBar panel in VS Code and choose the menu options for _View → Extensions_ or use `Ctrl + Shift + X` or `Cmd + Shift + X`
- Search for `css color collector` ,
- Click _Install_

## Features

- Collect all supported color format such as `hex`, `rgb`, `rgba`, `hsl`, `hsla`, `hwb` `oklab()`, `lch`, `color()` and 148 named color.
- Prevent duplicate hex color with variation and assign it into same variable name based on which comes first in the file.
for eg. `#fff` and `#ffffff` and `#ffffffff` are same color.
- Names of variables are intuitive and include property and selector name as prefixes. for eg.

below css file

```css
body {
  background-color: whitesmoke;
}
```

will be converted into

```css
:root {
  --body-bg-1: whitesmoke;
}

body {
  background-color: --body-bg-1;
}
```

- each variable name ends with `-<num>` to keep track how many colors are collected and used, further you can rename the variable using `Rename Symbol(F2)` action in vs code.

- After successfully execution of the command, the css file will be changed where color value will be replaced by css variables and a `:root` selector will be placed on the top of the file,after all `import` statements and also display notification of successful conversion.

## Extension Usage

- Open a css file
- Press <kbd>F1</kbd> to open the command palette
- Type `ccc` and select `collect colors` command or type <kbd>Ctrl + F7</kbd> or <kbd>Cmd + F7</kbd>
- After conversion done, you will see notification on bottom with message _variable conversion done successfully!_
- To revert back the changes in file, user need to do undo 2 times just after conversion.

## Working Demo

![extension working demo gif ](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/collector-demo.gif)

## Examples

### Basic

#### input file

![input css file](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/input.png)

#### output file

![converted file with css variable](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/output.png)

### Advance

#### input file

![css file with various color and selector](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-input.png)

#### output file

![converted output css file with variables ](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-output.png)

## check-list

- [ ] check whether file is correct (i.e. valid css file)
- [ ] check file is in save mode
- [x] handle when no color present in the css file
- [x] comments need to be escaped while parsing the css
- [x] other at rules selector need to handle such as

  - `@keyframes`
  - `@import`
  - `@media`
  - `@container`
  - `@page`
  - `@supports`
  - `@charset`

- [x] need to captured named color also.
- [x] support all color format ,
- [x] when there are multiple color on same line such as liner-background()
- [x] insert :root after _@import_ statements and add comment above it to identify
- [ ] media query selector name need to append media in variable name
- [x] skip existing `:root {}` while parsing the CSS file.
- [x] capture unicode selector such as 🎵

## Release Notes

- This is my first extension so if you find it useful then please support it by installing and giving constructive feedback.

### Known issues

- error _"invalid flag 'dgim'"_
  if you run the command or press `Ctrl + F7` and get above error then check whether you have [todo-tree extension](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) enabled in your vs code then please disable this extension, the reason is unknown so far, [issue raised for the same](https://github.com/Gruntfuggly/todo-tree/issues/732)

- if you found any issue, kindly raise [here](https://github.com/xkeshav/color-collector/issues/)

## TODO

- [] add feature to change variable naming for property , currently its hard coded like if property is `background-color` then its variable name would be `bg`
- [] undo changes to file

# css color collector

A vs code extension that works with _.css_ files which collect all color values from a css file and replace with a meaningful variable name and put all these color variables in a new :root pseudo selector

## Description

In an open CSS file, on execution of command, this extension parse the file and collect all color values and and assign them to a meaningful variable name and  replace the color values with these variable name in file, also these color variables placed under a `:root` pseudo selector.

## Use Case

This approach has a few benefits. 
First, it can help make your code more readable by giving names to colors that might otherwise be difficult to remember. 
Second, it can help you avoid duplicating colors throughout your code. 
And third, if you ever need to change a color value, you can do so in one place and have the change propagate throughout your entire stylesheet.

## Install

- Open Extensions sidebar panel in VS Code and choose the menu options for _View → Extensions_ or use `Ctrl + Shift + X` or `Cmd + Shift + X`
- Search for `css color collector` 
- Click _Install_

## Settings and Configuration

Open vs code settings ( <kbd>Cmd + , </kbd> or <kbd>Ctrl + ,</kbd>) and search __css color collector__ and found 3 settings and all are optional

![extension settings](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/settings.png)

1. if you need to run this extension for .scss file ( which is experimental though) then add following setting 
  
```json
"cssColorCollector.lookupFiles": [
      "**/*.css",
      "**/*.scss",
      "**/*.less"
]
```

1.  if you want to create a separate file for collected color variable then enable the `colorInSeparateFile` settings as below 

```json
"cssColorCollector.colorInSeparateFile": true
```

then a new file will be created same as to the open file location, and new file name in below format

 **root-variable--[open file name].css** 

 and it will open after conversion done.

## Features

- Collect all supported color format such as `hex`, `rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab()`, `oklab()`, `lch`, `oklch()`, `color()` and 148 named color.
- Prevent duplicate hex color with variation and assign it into same variable name based on which comes first in the file.
for eg. `#fff` and `#ffffff` and `#ffffffff` are same color.
- color variable name are intuitive, included property and selector name as prefix. for eg.

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

- After successfully execution of the command, the css file will be updated in 2 ways
  
    - color value will be replaced by css variables and 
    - if `colorInSeparateFile` option enabled then an import statement will be added on the top of file and new file will be generated where all collected color will be written.
    - otherwise a`:root` block will be added on the top of the file (after all `import` statements as per css specification )

- After successful execution of command , vs code will display notification.


## How to Use 

- Open a css file
- Press <kbd>F1</kbd> to open the command palette
- Type `ccc` and select *collect colors* command OR type <kbd>Ctrl + F7</kbd> or <kbd>Cmd + F7</kbd>
- After completion of command, you will see notification message _variable conversion done successfully!_

## Working Demo

![working demo gif ](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/collector-demo.gif)

## Examples

### Basic

#### input file

![input css file](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-input.png)

#### output file

![converted file with css variable](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-output.png)

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
- [x] At rules selector need to handle , such as

  - `@keyframes`
  - `@import`
  - `@media`
  - `@container`
  - `@page`
  - `@supports`
  - `@charset`

- [x] capture all valid named color.
- [x] support all color syntax.
- [x] handle when there are multiple color on same line such as liner-background()
- [x] insert :root after _@import_ statements and add comment above it to identify
- [ ] media query selector name need to append media in variable name
- [x] skip existing `:root {}` while parsing the css file.
- [x] capture unicode selector such as 🎵
- [x] option to create separate file for collected color variables 
- [.] scss file support  (work partially, haven't checked for complex but simple scss file works)

## Release Notes

- This is my first extension so if you find it useful then please provide feedback to improve the experience in better way. Thanks.

### Known issues

- _"invalid flag 'dgim'"_
  if you run the command and get above error then check whether you have [todo-tree extension](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) enabled in vs code then please disable that extension to make this extension work properly. [issue raised on the same](https://github.com/Gruntfuggly/todo-tree/issues/732) and checking for solution

- if you found any issue or suggestion, please raise [here](https://github.com/xkeshav/color-collector/issues/)

## TODO

- [] add feature to change variable naming for property , currently its hard coded like if property is `background-color` then its variable name would be `bg`
- [] To revert back the changes in file, user need to do undo 2 times just after conversion, that need to handle
- [] scss file support, which works partially. need to check for less file also
- [] support for new color format `color-mix()` and `color-contrast()` [reference](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)
- value currentColor, transparent, system-color are not being checked
- if there are style declaration above :root {} then this extension will not parse those block

## Reference

 - [w3.org color specification](https://www.w3.org/TR/css-color-4/#introduction)
 - [Regular Expression](https://www.unicode.org/reports/tr18/#domain_of_properties)
 - [Color from MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
 - [VS code Discussion](https://github.com/microsoft/vscode-discussions)
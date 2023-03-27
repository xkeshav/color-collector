# css color collector

A vs code extension that works with css file, collect all color values from a css file and replace with a meaningful variable name and put all these color variables in a new :root pseudo selector

## Description

In an open CSS file, on execution of `collect colors` command, this extension parse the open file and read all color written in the file and and assign every color value to a meaningful variable name and replace the color value with variable and these color variables collected under a `:root` pseudo selector.

## Use Case

This approach has a few benefits.

First, it can help make your code more readable by giving names to colors that might otherwise be difficult to remember.

Second, it can help you avoid duplicating colors throughout your code.

And third, if you ever need to change a color value, you can do so in one place and have the change propagate throughout your entire stylesheet.

## Install

- open VSCode, and go to extension panel from activity bar or type <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>x</kbd>
- search for `css color collector`
- Click _Install_
- reload the vscode if it is prompted

## How to Use

- Open a css file ( or sass file )
- Press <kbd>F1</kbd> to open command palette
- Type `ccc` and select _collect colors_ command
- Or alternatively use keyboard shortcut <kbd>Ctrl + F7</kbd> or <kbd>Cmd + F7</kbd>
- if there are any error while running the command then notification message will be displayed
- After completion of command, a notification message of successful conversion will be displayed.

## Settings and Configuration

Open Settings using <kbd>Cmd + , </kbd> or <kbd>Ctrl + ,</kbd> and search **color collector**

![cs code settings](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/vscode-settings-for-color-collector.png))

1. if you need to run this extension for .scss file ( which is experimental though) then add following setting

```json
"cssColorCollector.lookupFiles": [
      "**/*.css",
      "**/*.scss",
      "**/*.less"
]
```

1.  To create a separate file for `:root` selector then enable below setting in your _Workspace_ ( if no workspace then in _User_ ) Settings file (by default it is not enabled)

```json
"cssColorCollector.colorInSeparateFile": true
```

_Note:_ New file will be created in the open file directory and file name will be **color-collector--[open file name].css**

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

_Note:_ if extension unable to parse property and selector of a color then variable name would be `--defaultSelector__defaultElement--<number>`

- Each variable name suffixed with `-<number>` to keep track how many colors are collected.

- After successfully execution of the command, the css file will be updated in 2 ways

  1. color value will be replaced with css variable names in the file.

  2. a new `:root` pseudo selector will be created which contains all variables with color values in it's declaration block and placement of `:root` vary as follow

     - if `cssColorCollector.colorInSeparateFile` is `false` or not set, then `:root` will be added on the top of the file, after all `import` statements.

     - if `cssColorCollector.colorInSeparateFile` is enabled then `:root` will be placed in a new file and a import statement will be added in the css file.

Note: new file will be created in the open css file's directory and name format will be _color-collector--[open-file-name].css_ and multi line comment will be added on top of `:root` which mention the source file and date of conversion.

- A single line comment will be added over the `:root` or `@import` statement to identify.

- A notification message will be displayed after successful execution of the _collect colors_ command.

## Working Demo

![working demo gif ](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/collector-demo.gif)

### when `cssColorCollector.colorInSeparateFile` is `true`

![working demo when colorInSeparateFile option enable](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/demo-when-colorInSeparteFile-option-enable.gif)

## Screenshots

### Basic Example

#### input file

![input css file](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-input.png)

#### output file

![converted file with css variable](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-output.png)

### Advance Example

#### input file

![css file with various color and selector](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-input.png)

#### output file

![converted output css file with variables ](https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-output.png)

## check-list

- [x] check whether file is correct (i.e. valid css file)
- [x] check file is in save mode
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
- [x] new file create parallel to open file whether it is on same workspace or different or just file opened.
- [.] scss file support (work partially, haven't checked for complex but simple scss file works)

## Release Notes

- This is my first extension so if you find it useful then please [write review](https://marketplace.visualstudio.com/items?itemName=xkeshav.css-color-collector&ssr=false#review-details) to improve the experience in better way.

## Contribution Guide

To raise any issue/ suggestions / feature [write here](https://github.com/xkeshav/color-collector/issues/) .

moreover, if you want to contribute, please feel free to raise the [PR](https://github.com/xkeshav/color-collector/pulls)

## Future Work

- [ ] add feature to change variable naming for property , currently its hard coded like if property is `background-color` then its variable name would be `bg`
- [ ] To revert back the changes in file, user need to do undo 2 times just after conversion.
- [ ] scss file support, which works partially. need to check for less file also
- [ ] support for new color format `color-mix()` and `color-contrast()` [reference](https://www.smashingmagazine.com/2021/11/guide-modern-css-colors/)
- [ ] if there are style declaration above :root {} then this extension will not parse those lines
- [ ] create web extension for the same, currently it is for desktop

## Known issues

- _"invalid flag 'dgim'"_
  if you run the command and get above error then check whether you have [todo-tree extension](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) enabled in vs code then please disable that extension to make this extension work properly. [issue raised on the same](https://github.com/Gruntfuggly/todo-tree/issues/732) and checking for solution

## References 

below are useful links which helps me to develop the extension

- [w3.org: color specification](https://www.w3.org/TR/css-color-4/#introduction)
- [tc39: Regular Expression](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects)
- [MDN: Color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [W3C: Selector Syntax](https://w3c.github.io/csswg-drafts/selectors/#syntax)
- [VS code: Discussion Forum](https://github.com/microsoft/vscode-discussions)
- [VS Code Extension API](https://code.visualstudio.com/api)

few of the notable extensions which helps to write better code and test cases
  - Peacock
  - Project Manager
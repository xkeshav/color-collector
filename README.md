# CSS Color Collector

![VS Marketplace][marketplace]
![Download][download count]
![Install][install count]
![License][license]

A VS code extension which works with css file, collect every color from A css file and assign it to a meaningful css variable and put these variables under a new `:root` pseudo selector block on the file.

## Description

In an open css file, on execution of `collect colors` command, this extension parse the file and search all color value across all supported color syntax and and assign every color value to a meaningful css variable name and replace the color value with variable and these color variables collected under a `:root` pseudo selector.

[VS Code Marketplace Link](https://marketplace.visualstudio.com/items?itemName=xkeshav.css-color-collector)

## Use Case

This approach has a few benefits.

First, it can help make your code more readable by giving names to colors that might otherwise be difficult to remember.

Second, it can help you avoid duplicating colors throughout your code.

And third, if you ever need to change a color value, you can do so in one place and have the change propagate throughout your entire stylesheet.

## Install

- open VSCode, and go to extension panel from activity bar or type <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>x</kbd>
- search for `CSS Color Collector`
- Click _Install_
- reload the vscode if it is prompted.

## How to Use

- Open a css file ( or sass file )
- Press <kbd>F1</kbd> to open command palette.
- Type `ccc` and select _collect colors_ command or alternatively use keyboard shortcut <kbd>Ctrl + F7</kbd> or <kbd>Cmd + F7</kbd>
- if there are any error in file while running the command then notification message will be displayed.
- After completion of the command, a notification message of successful conversion will be displayed.

## Working Demo

**collect and replace on same file.**

<img src="https://raw.githubusercontent.com/xkeshav/color-collector/main/images/collector-demo.gif" title="css collector demo"/>

**create separate file for :root**, when `cssColorCollector.colorInSeparateFile` is `true`

<img src="https://raw.githubusercontent.com/xkeshav/color-collector/main/images/demo-create-separate-file.gif" title="demo when options enabled"/>

## Configuration Option

To create a separate file for `:root` block

- open your _Workspace_ ( if no workspace then in _User_ ) settings, using <kbd>Cmd + , </kbd> or <kbd>Ctrl + ,</kbd>
- search **CSS Color Collector**
- check the tick box for against _Color In Separate File_ option
- or add below setting in your setting file.

```json
"cssColorCollector.colorInSeparateFile": true
```

check screenshot below for the same

![vs code settings][0]

note: if this option checked in either of _User Settings_ or _Workspace Settings_ then it will be consider as a true

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

- variable name value will be stored in lowercase only, so `Black`or `BlaCK` will be stored under same variable name and value will be `black`

- After successfully execution of the command, the css file will be updated in 2 ways

  1. color value will be replaced with css variable names in the file.
  2. all css variables will be collected and placed under a `:root` pseudo selector and the placement of `:root` block depends on the configuration as follow

  - if `cssColorCollector.colorInSeparateFile` is not set or `false` then a new `:root` pseudo selector will be added on the top of the, after all `import` statements as per css specification )
  - if `cssColorCollector.colorInSeparateFile` is enabled ( i.e. `true` ) then `:root` will be placed in new file and an import statement will be added on the top of the open file.

_Note:_ New file will be created in the same directory where the css file is opened and naming convention of file would be _color-collector--[open-file-name].css_ and multi line comment will be added on top of `:root` which mention the source file and date of conversion.

- After successful execution of command, extension will display notification message.

- comment will be added over the `:root` block or `@import` statement to identify the changes.

- A notification message will be displayed after successful execution of the _collect colors_ command.

- To test, sample css files to can be download from _sample-files_ folder

## Screenshots

### Basic Example

#### input file => [basic.css file][basic_css_file]

![basic: before conversion][1]

#### output file - basic

![basic: after conversion][2]

### Advance Example

#### input file => [advance.css][advance_css_file]

![advance: before conversion][3]

#### output file - advance

![advance: after conversion ][4]

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
- [x] skip existing `:root {}` and `@import` statements while parsing the file.
- [x] capture unicode selector such as 🎵
- [x] option to create separate file for collected color variables
- [x] new file create parallel to open file whether it is on same workspace or different or just file opened.
- [x] handle data attribute while parsing for eg `.card[data-color=white]{color: white}`
- [x] capture color when `none` written in color syntax.
- [.] handle minified ( single line ) css
- [.] scss/less file support, currently works for simple file.

## Release Notes

- This is my first extension so if you find it useful then please [write review](https://marketplace.visualstudio.com/items?itemName=xkeshav.css-color-collector&ssr=false#review-details) to improve the experience in better way.

## Contribution Guide

To raise any issue / suggestion / request [write here](https://github.com/xkeshav/color-collector/issues/) .

moreover, if you want to contribute, please feel free to raise the [PR](https://github.com/xkeshav/color-collector/pulls)

## Future Work

- [ ] add feature to change variable naming for property , currently its hard coded like if property is `background-color` then its variable name would be `bg`
- [ ] currently, to revert back the changes made by extension, user need to do undo 2 times just after the conversion.
- [ ] check how to make it working for css pre processor file like `.scss` and `.less` , currently works partially( means did not check over a very complex sass rich file)
- [ ] add support for new color format `color-mix()` , `color-contrast()` and relative color syntax.
- [ ] develop web extension for the same, currently it is for desktop

## Known issues

- _"invalid flag 'dgim'"_
  if you run the command and get above error then check whether you have [todo-tree extension](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) enabled in vs code then please disable that extension to make this extension work properly. [issue raised on the same](https://github.com/Gruntfuggly/todo-tree/issues/732) and checking for solution

## References

followings are useful links which helps me to develop this extension

- [w3.org: color specification](https://www.w3.org/TR/css-color-4/#introduction)
- [tc39: Regular Expression](https://tc39.es/ecma262/multipage/text-processing.html#sec-regexp-regular-expression-objects)
- [MDN: Color syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [W3C: Selector Syntax](https://w3c.github.io/csswg-drafts/selectors/#syntax)
- [VS code: Discussion Forum](https://github.com/microsoft/vscode-discussions)
- [VS code Extension API](https://code.visualstudio.com/api)

Also, few of the notable extensions which helps to write better code and test cases

- Peacock
- Project Manager

Thank you for your time for reading.

[0]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/color-collector-settings.png
[1]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-input.png
[2]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-output.png
[3]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-input.png
[4]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-output.png
[basic_css_file]: https://github.com/xkeshav/color-collector/blob/main/sample/basic.css
[advance_css_file]: https://github.com/xkeshav/color-collector/blob/main/sample/advance.css

---

### Keshav Mohta _<xkeshav@gmail.com>_

<!-- Link Alias -->

[marketplace]: https://badgen.net/vs-marketplace/v/xkeshav.css-color-collector?icon=visualstudio
[download count]: https://badgen.net/vs-marketplace/d/xkeshav.css-color-collector
[install count]: https://badgen.net/vs-marketplace/i/xkeshav.css-color-collector
[license]: https://badgen.net/static/License/Apache?color=purple

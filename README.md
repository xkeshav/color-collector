# color-collector

A simple vs code extension which works with *.css* files

it scan all color value ( hex, name or any other format) across all property in the opened css file
and assign the color value into a variable which somehow represent property and selector as a prefix 
and add a `:root` selector which contains all these color variables
and replace the color with new variable name in the css file

extension also check for duplicate color used in multiple places and assign into a single variable

## Features

- support all color format
- parse css file with all At Rules
- duplicate color comes under one variable ( all hex format )

![collect and convert color into variable gif][collect]

#### input

![input](images/input2.png)

#### output

![output](images/output2.png)

## Requirements

user must have installed

- node js
- vs code

## Extension Settings

- when you open a css file the from command panel ( `Ctrl + F1` or `Cmd + F1` )
- search for `ccc: collect css` command or use `Ctrl + F7` or `Cmd + F7` 
- after running this command, your file will be changed with css color variables 

## Known Issues

- media query selector name need to append media in variable name

## CHECK-LIST

- [ ] check whether file is correct (i.e. valid css file)
- [ ] check file is in save mode
- [ ] handle error if no selector/color present in file
- [x] comments need to be escaped while parsing the css
- [x] other at rules selector need to handle such as

  - `@keyframes`,
  - `@import`,
  - `@media`
  - `@container` ,
  - `@page` ,
  - `@supports` ,
  - `@charset`,

- [x] need to captured named color also.
- [x] support all color format
- [x] when there are multiple color on same line such as liner-background()
- [x] insert :root after _@import_ statements

## Release Notes

- Unit Test Done

### foot note

- if you have todo-tree extension enabled then this extension will likely to fail, reason unknown so far, [issue raised here](https://github.com/Gruntfuggly/todo-tree/issues/732)


[collect]: images/collector.gif
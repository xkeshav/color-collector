# color-collector

A simple vs code extension which works with *.css* files and assign all color in document into a variable


## Description 

This extension scan all color value across all css property in an opened css file
and collect the color value and assign into an individual variable for every different color
and add a `:root` selector on top of document which contains all these variables
and also replace the color values with new variable name in the css file.

extension also check for duplicate color used in multiple places and assign into a single variable

## Features

- scan over all color format, including `hex`,  `rgb`, `rgba`, `hsla`, `hwb`, `hsl`,  named color such as `red` with all variations. 
- variable name would be more verbose which contains property and selector as a prefix 
- for eg. 

initial css file 
```css
body {
    color: red; 
  }
```

here variable name will be `--body-txt-1`

final css file, after execution of command

```css
:root {
  --body-txt-1: red;
}

body {
  color: var(--body-txt-1);
}

```

here number will be prepend in each variable to get exact how many color code are being used in the file, we can change the name using `Rename Symbol` action of vs code.

- duplicate or repeated colors comes under one variable, which comes first in document, including all variation of hex color format

- after successfully execution of the command `ccc:collect css`  your file will be changed where color value will be replaced by css variables and a :root property added on top of file , after all `url` statements ( if any )



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

![extension working demo][collect]

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
- [ ] add feature to change variable naming convention

## Release Notes

- Unit Test Done

### foot note

- if you have todo-tree extension enabled then this extension will likely to fail, reason unknown so far, [issue raised here](https://github.com/Gruntfuggly/todo-tree/issues/732)


[collect]: images/collector-demo.gif
# CSS Color Collector

![VS Marketplace][marketplace]
![Download][download count]
![Install][install count]
![License][license]

A VS code extension which works with css file, collect every color from A css file and assign it to a meaningful css variable and put these variables under a new `:root` pseudo selector block on the file.

## Description

The **CSS Color Collector** makes managing colors in CSS easier by automating the process of extracting colors into variables. Upon running the `collect colors` command in an open CSS or SASS file, it:

- Parses the file to find all colors.
- Assigns each color to a named CSS variable.
- Replaces occurrences of each color with the corresponding variable.
- Organizes the variables under a `:root` block at the beginning of the file or in a separate file (based on configuration).

[Visit the VS Code Marketplace][vscode marketplace extension]

## Use Cases

This approach has a few benefits.

- **Improves Code Readability:** Gives descriptive names to colors, making your stylesheet easier to understand.
- **Avoids Color Duplication:** Reduces repetition of the same colors throughout your code.
- **Centralized Color Management:** Changing a color value is as simple as updating it in one place, with the change reflected across the entire stylesheet.

## Installation

- Open VSCode, and go to extension panel from activity bar or type <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>x</kbd>
- Search for `CSS Color Collector` or `xkeshav.css-color-collector`
- Click _Install_
- Reload the vscode if it is prompted.

## How to Use

- Open a css file ( or sass file )
- Press <kbd>F1</kbd> to open command palette.
- Type `ccc` and select _collect colors_ command or alternatively use keyboard shortcut <kbd>Ctrl + F7</kbd> or <kbd>Cmd + F7</kbd>
- if there are any error in file while running the command then notification message will be displayed.
- After completion of the command, a notification message of successful conversion will be displayed.

## Working Demo

### collect and replace demo within same file

![css collector demo][demo]

### When [`cssColorCollector.colorInSeparateFile`][setting] is enabled

![separate file demo][separate file demo]

## Configuration Option

To create a separate file for `:root` block

- Open [_Workspace_ ( or _User_ ) settings](vscode://settings)
- enable the [_Color In Separate File_][setting] option OR add below setting in your setting file.

```json
"cssColorCollector.colorInSeparateFile": true
```

check screenshot below for the same

![vs code settings][0]

note: if this option checked in either of _User Settings_ or _Workspace Settings_ then it will be consider as a true

## Features

- **Color Collection:** Supports various color formats like `hex`, `rgb`, `rgba`, `hsl`, `hsla`, `hwb`, `lab()`, `oklab()`, `lch`, `oklch()`, `color()`, `contrast-color()`, and 248 named colors.  
- **Variable Assignment:** Assigns colors to intuitive variable names based on their property and selector.

For Example:

```css
body {
  background-color: whitesmoke;
}
```

Converts to:

```css

:root {
  --body-bg-1: whitesmoke;
}

body {
  background-color: var(--body-bg-1);
}
```

- **Duplicate Handling:** Prevents duplication by treating variations like `#fff`, `#ffffff`, and `#ffffffff` as the same color.
- **Variable Storage:**  All variables stored in lowercase to maintain consistency, `Black`or `BlaCK` will be stored under same variable name and value will be `black`
- **support minifies and sass**: Minified and SASS/LESS/SCSS files are also supported( with no much complexity)


> [!NOTE]

- if extension unable to parse property and selector of a color then variable name would be `--defaultSelector__defaultElement--<number>`

- Each variable name suffixed with `-<number>` to keep track how many colors are collected.

- After successfully execution of the command, the css file will be updated in 2 ways

  1. color value will be replaced with css variable names in the file.
  2. all css variables will be collected and placed under a `:root` pseudo selector and the placement of `:root` block depends on the configuration as follow

  - if [colorInSeparateFile][setting] option is ( default is `false` )

    - set or enabled or `true` then `:root` will be placed in a new file and an import statement will be added on the top of the open file.
      - New file will be created in the same directory where the css file is opened and naming convention of file would be _color-collector--[open-file-name].css_ 
        and multi line comment will be added on top of `:root` which mention the source file and date of conversion.
    - not set or `false` then a new `:root` pseudo selector will be added on the top of the, after all `import` statements as per CSS specification.

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


## Known issues

> [!CAUTION] 
>   if you run the command and get above error then check whether you have [todo-tree extension][todo-tree] enabled in vs code 
> then you need to disable the extension to make this extension work properly. [issue raised on the same][todo-issue] and checking for solution

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

[0]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/color-collector-settings.webp
[1]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-input.webp
[2]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/basic-css-output.webp
[3]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-input.webp
[4]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/advance-css-output.webp
[basic_css_file]: https://github.com/xkeshav/color-collector/blob/main/sample/basic.css
[advance_css_file]: https://github.com/xkeshav/color-collector/blob/main/sample/advance.css
[demo]:https://raw.githubusercontent.com/xkeshav/color-collector/main/images/collector-demo.gif
[separate file demo]: https://raw.githubusercontent.com/xkeshav/color-collector/main/images/demo-create-separate-file.gif
[todo-tree]: https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree
[todo-issue]: https://github.com/Gruntfuggly/todo-tree/issues/732
[setting]: vscode://settings/cssColorCollector.colorInSeparateFile

## Author 

### Keshav Mohta _<xkeshav@gmail.com>_

If you find this extension helpful, please ⭐️ star the repo, like it, and support my work to help keep it growing! Your support means a lot! 😊 [Star on GitHub][Repo]

<!-- Link Alias -->
[Repo]: https://github.com/xkeshav/color-collector
[vscode marketplace extension]: https://marketplace.visualstudio.com/items?itemName=xkeshav.css-color-collector
[marketplace]: https://badgen.net/vs-marketplace/v/xkeshav.css-color-collector?icon=visualstudio
[download count]: https://badgen.net/vs-marketplace/d/xkeshav.css-color-collector
[install count]: https://badgen.net/vs-marketplace/i/xkeshav.css-color-collector
[license]: https://badgen.net/static/License/Apache?color=purple

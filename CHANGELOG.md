# Change Log

All notable changes to the "css-color-collector" extension will be documented in this file.

## [0.1.0]

- Initial release.
- collect color values from cs file and assign into css variables.

## [0.3.0]

- update README
- added screenshots and demo gif with absolute path.

## [0.4.0]

- skip existing :root variables in css file.

## [0.5.0]

- handle unicode selector names.
- update README with more detail.
- change command name _collect colors_ .

## [0.7.0]

- added settings to create separate file for collected variable.
- added support for new color format - `lch()`, `oklab()` and `color()`
- updated logo.

## [0.8.0]

- test cases updated.
- SCSS file support added, working for simple .scss file.

## [1.0.0]

- new screenshot and option enable demo gif added.
- separate file created on same directory where the open file is.
- file name displayed in the information message.
- check whether opened css file is valid and saved.
- date and original file name added in the comment in new file.
- import statements skipped while parsing.
- keyboard shortcut available for scss and less file.

## [1.1.1]

- fixed issue of changing white-space property into variable issue
- handle when named color in [data-attribute=property] selector
- handle when there is (num, num, num) in other property such as `cubic-bezier(0.65 -0.02, 0.72, 0.29)`
- parse minify css
- import and selector regex updated.

## [1.1.2]

- README.MD updated
- added sample css file link in README to test
- images and gif updated

## [1.3.0]

- added sample css file link in README
- images and gif updated in README

## [1.7.0]

- capture color while `none` keyword used in color syntax.
- handle scenarios when whitespace around `()` in color syntax.
- test case updated

## [1.8.0]

- User settings changes affects immediately.

# Todo

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
- [x] handle minified ( single line ) css
- [.] scss/less file support, currently works for simple file.
- [x] skip variable property in a selector block, other than `:root` such as

```css
.main {
  --c1: #111;
}
```

this will not change the css variable `--c1`


## Future Work

- [ ] add feature to change variable naming for property , currently its hard coded like if property is `background-color` then its variable name would be `bg`
- [ ] currently, to revert back the changes made by extension, user need to do undo 2 times just after the conversion.
- [ ] check how to make it working for css pre processor file like `.scss` and `.less` , currently works partially( means did not check over a very complex sass rich file)
- [ ] add support for new color format `color-mix()` , `color-contrast()` and relative color syntax.
- [ ] develop web extension for the same, currently it is for desktop

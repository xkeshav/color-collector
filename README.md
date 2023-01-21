# color-collector

a simple vs code extension which works with .CSS files

which collect all color code from a css file 
and assign the color in a variable 
and add a :root selector which contains all variables 
and also replace the color code with new variable name

so that once all color collected on one place, we can change theme by changing that :root color-schema only

## Features

- support all color format except where user described turn|rad as color variable

#### input

![input](images/input.png)

#### output

![output](images/output.png)


## Requirements

user must have installed
- node js
- vs code

## Extension Settings
run `cfg`

## Known Issues

- currently selector not getting changed , all comes with first variable name.

## Release Notes

## TODO

- support all format
- when there are multiple color on same line such as liner-background()
- - remove keyframes/ import / media / container

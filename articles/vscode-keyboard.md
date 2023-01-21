Hi,

This is my very first post and this is about the most loving IDE VS CODE and few keyboard shortcut which I use daily and also few addition things how to add new keyboard shortcut or how to change some change existing keyboard shortcut.

let's deep into it,

Note the post bellow and even in vs code the `+` written in Key board binding is not a literal _+_ key but this is just for showing the keyboard combination. And the letter shown are capital also not require caps lock on or pressing with Shift key, they are lowercase letter because if you look at keyboard, every letter written in capital.

also in VS code when you press keyboard shortcut, it is displayed in the status bar, it doesn't exist, it will be displayed there

for eg:

`Ctrl + -` means press _control_ key and press _-_.

`Ctrl + K Ctrl + S` means press Ctrl + K and then press Ctrl + S means keep Ctrl key presses and write K and S ( and here K and S will not to be Capital)

`Ctrl + K Z` means press Ctrl and K together and release Ctrl key and press Z

# Keyboard Shortcuts in VS Code

## 1. Delete without changing the clipboard content

Normally what we do to delete a line, just `Ctrl + X` as it does the job As this is how it works in most of application, but this has a flaw, not exactly a flaw but we can say limitation or side effect.

this cut the line, so if we have something very important in your clipboard, okay what is clipboard?
whenever we do copy action ( using `Ctrl + C` ) it is stored in the clipboard, so clipboard is a place where copy being stored/put and this is 1 instance, whenever we copy some other content, previous copied data lost, so we do that first we copy 1 line and paste somewhere and now copy next line and paste some where.

so coming to the point, this `Ctrl + X` overwrite your copied data and problem here either we do `Ctrl + Z` and copy the same code block but sometimes we have something in clipboard which was copied from other place/application and in this case `Ctrl + Z` will not work.

so always use `Ctrl + K` to remove the line without losing your clipboard data.

> `Cmd + K` in macOS

> `Ctr + K` in Ubuntu/Windows

## 3. Multi cursor key modifier

since sublime text, multi cursor is my favorite utility, it helps to edit altogether on various places in file.

in Mac OS multi cursor can be invoked pressing Option key and in Windows it can be done using Ctrl key but sometimes it doesn't seems to work or you want to change the key combination, like in Ubuntu, it doesn't work, so follow these steps

1. go to settings ov VS Code , pressing `Cmd +,` or `Ctrl +,`
2. go to Workspace Tab or you can do in User tab also but I prefer to use in Workspace
3. write in the searchbox for multi cursor modifier
4. it value would be Alt, change it to CtrlCmd.
5. you can verify the setting in _settings.json_ ( click on top icon), there would be an entry as below

```json
  "editor.multiCursorModifier": "ctrlCmd"
```

## 3. Move Line Up/Down

many of times we need to move the line of code above or below some line and we usually do, Cut, and paste on the desired line but there is a easy keyboard shortcut

> `Alt + KeyDown` and `Alt + KeyUp`

to know the keyboard settings, you can click on setting icon in side panel and click on Keyboard shortcut in the context menu or use Ctrl+K Ctrl+ S ( keep control key pressed and click on k and s, I find it very difficult whether we have to use press Ctrl once with small k and later s)

keyboard binding panel will be open, there you can search using keyboard recording ( which I tell you later) or writing a text, search there Move Line Up

there you can see the key combination, and make sure that `when `column must not be empty, if it is empty then fill it up by clicking on row and right click _Change When Expression_ and write , if you click directly on row, it will open the keyboard shortcut window, and its very annoying sometimes.

> `editorTextFocus && !editorReadonly`

## how to search with key binding

now how to search with key bindings, suppose you want to know what it does when press `Alt + d`, so go to keyboard setting panel and there is keyboard icon on right side of search input, when you hover it it says `Record Keys`, press that and now enter `Alt + d`, it will show which action is binding with these keystroke, again click on Record Keys to start new combination.

## 4. Select All Occurrences of a word or tag in a File

sometime you need to select same word in the file for

- either replace it with new name ( here we can use search and Replace)
- rename the word ( here we can use Rename Symbol)

but sometime you just to select few occurrences then

> Select the text and click `Ctrl + d`

it will select the next occurrence in the file and also enable multi cursor , keep pressing Ctrl+d and it will select the next occurrence

## 5. duplicate the line (Up or Down)

many times we need to make few changes what written on previous line, so what we usually do, copy the line and paste on next line but there is a smart way to do it and use

> `Alt + d`

if you search in keyboard binding (copy line Up), it is very length key combination , so I have changed the keyboard combination by simply click on the row, but when you enter desired keyboard shortcut, it might conflicts with other shortcut and it will be shown below the shortcut key , so choose shortcut wisely.

you can write below code in keybindings.json

```json
 {
    "key": "alt+d",
    "command": "editor.action.copyLinesDownAction",
    "when": "editorTextFocus && !editorReadonly"
  },
```

and it will add new shortcut but if you want to remove the previous key combination then write below json also

```json
{
  "key": "ctrl+shift+alt+down",
  "command": "-editor.action.copyLinesDownAction",
  "when": "editorTextFocus && !editorReadonly"
}
```

see the _-_ sign ahead of the command

## 6. Cursor on Previous Position

in VS code, we do not have bookmarking feature by default and sometimes we want to go back where was the last cursor position, so there is shortcut for that

> `Option + -` ( macOS )
> `Ctrl + Alt + -` (Ubuntu)

every time you press this it will navigate back to the previous position of cursor or we can say cursor history, even it works across open files, suppose you click on file A line #20 then file B line # 20 then file A line # 40

and now when you press `Option + -` it will goes to file B line # 20 and again pressing `Option + -` will takes to file A line #20

# Termbox assets

Contains static assets (like images) that are used to style our application.

## File content
* don't add intended paddings to the image (we can do this with CSS in a more flexible manner)
* use a transparent background if possible at all
* check with devs if change of state (e.g. "active" rotation / color) needs multiple files

## File naming
* create a folder for shared prefixes
* indicate dimensions in file name in case of bitmap files
* name by what it objectively shows, not what its (current) purpose is
* lower case, underscore (_) as separator for the file name
* if different states of the same image (e.g. rotated) exist, reflect in file name accordingly

### Examples

* `arrow_in_circle_grey_up.svg`
* `star_outline_black_25_25.png`

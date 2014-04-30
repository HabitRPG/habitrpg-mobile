Cordova doesn't have a way of copying res/screen/* to their proper directories. PhoneGap Build does, but we're moving
off PGB to support 3rd-party plugins. So to add res/screen/* to their respective directories, run `sh ./res/screen.sh`
which will copy the files.

As for res/icon/*, config.xml *does* have a way of copying files (see http://goo.gl/Rkmdj6). However, the tool cordova-gen-icon
makes life easier by allowing you to have one large icon file, and it will use ImageMagick to resize to various formats
and save in the proper directoris. Run `sh ./res/icons.sh`

The generated/ folder uses http://ticons.fokkezb.nl/ to generate all necessary files. I haven't touched the output, but
if they're better quality / provide more files that we need, let's use them.
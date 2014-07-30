HabitRPG-Mobile
===============

This is the mobile-specific code repository for [HabitRPG](https://github.com/HabitRPG/habitrpg).

If you would like to contribute, please review the [Contributing to HabitRPG wiki page](http://habitrpg.wikia.com/wiki/Contributing_to_HabitRPG).


habitrpg-mobile uses the Ionic Framework.  The remainder of this readme is specific to the Ionic Framework.


## Ionic App Base


A starting project for Ionic that optionally supports
using custom SCSS.

### Using this project

We recommend using the `ionic` utility to create new Ionic projects that are based on this project but use a ready-made starter template.

For example, to start a new Ionic project with the default tabs interface, make sure the `ionic` utility is installed:

```bash
$ sudo npm install -g ionic
```

Then run:

```bash
$ sudo npm install -g ionic
$ ionic start myProject tabs
```

More info on this can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page.

### Installation

While we recommend using the `ionic` utility to create new Ionic projects, you can use this repo as a barebones starting point to your next Ionic app.

To use this project as is, first clone the repo from GitHub, then run:

```bash
$ cd ionic-app-base
$ sudo npm install -g cordova ionic gulp
$ npm install
$ gulp init
```

### Using Sass (optional)

This project makes it easy to use Sass (the SCSS syntax) in your projects. This enables you to override styles from Ionic, and benefit from
Sass's great features.

Just update the `./scss/ionic.app.scss` file, and run `gulp` or `gulp watch` to rebuild the CSS files for Ionic.

Note: if you choose to use the Sass method, make sure to remove the included `ionic.css` file in `index.html`, and then uncomment
the include to your `ionic.app.css` file which now contains all your Sass code and Ionic itself:

```html
<!-- IF using Sass (run gulp sass first), then remove the CSS include above
<link href="css/ionic.app.css" rel="stylesheet">
-->
```
## Issues
If you find a general (i.e., not exclusive to mobile platforms) HabitRPG issue please post it to the main [HabitRPG issue tracker](https://github.com/HabitRPG/habitrpg/issues).  

If you have an Ionic Framework issue or question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).  If there is truly an Ionic Framework error, follow their guidelines for [submitting an issue](http://ionicframework.com/contribute/#issues) to the main Ionic repository. 

Pull requests are welcome here!


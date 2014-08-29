habitrpg-mobile
=====================

Official HabitRPG mobile app, build with [PhoneGap](http://cordova.apache.org/)
and [AngularJS](http://angularjs.org/).

## Requirements

NodeJS and NPM are required to build habitrpg-mobile, please refer to your
platform's documentation on how to install these.

## Getting started developing locally

1. Clone the repository
  `git clone https://github.com/HabitRPG/habitrpg-mobile.git`
2. Install utilities
  `npm install -g bower cordova ionic`
3. Install dependencies
  `npm install`
4. Install bower components
  `bower install`
5. Start the local testing server
  `gulp`
6. Navigate to `http://localhost:9000`

## Building for Mobile

Platforms are: `ios` or `android`

1. Add cordova platform
   `ionic platform add <platform>`
2. Start the application on a connected device
   `ionic run <platform>`

For all the other ionic commands see `ionic --help`

## Contributing

If you would like to contribute, please review the
[Contributing to HabitRPG wiki page](http://habitrpg.wikia.com/wiki/Contributing_to_HabitRPG).

## Issues
If you find a general (i.e., not exclusive to mobile platforms) HabitRPG issue
please post it to the main [HabitRPG issue tracker](https://github.com/HabitRPG/habitrpg/issues).

If you have an Ionic Framework issue or question consider posting it on the [Ionic Forum](http://forum.ionicframework.com/).
If there is truly an Ionic Framework error,
follow their guidelines for [submitting an issue](http://ionicframework.com/contribute/#issues) to the main Ionic repository.

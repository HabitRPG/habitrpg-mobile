HabitRPG Mobile
===============

Official HabitRPG mobile app, build with [PhoneGap](http://cordova.apache.org/) and [AngularJS](http://angularjs.org/).

#Installation

##Install the mobile app
 * [Install Node](http://nodejs.org/)
 * `npm install -g yo generator-angular grunt-cli bower`
 * `npm install`
 * `npm start`
 * Run the Ripple Emulator in your browser open browser at http://localhost:9000
   * Turn off tooltips
   * Disable cross domain proxy
   * ([see screenshot](https://www.evernote.com/shard/s17/sh/21bb281f-db1f-4940-b614-844e4fa513e9/b3ba8e94153c9fe7668d07f2fa0f1eec))

##Install HabitRPG Server
If you want to test the app against a local test server instead of production (it's not entirely necessary, but may give you
some more insight when debugging), See installation instructions at https://github.com/lefnire/habitrpg/wiki/Running-Locally,
be sure to checkout the #develop branch instead of #master

##Building
When everything's ready to go, I run `grunt build` which creates a minified / concat'd / optimized directory at `dist/`.
Keep this in mind if there are extra files you're adding outside the usual locations, or if your scripts don't like to
be minified for whatever reason (it's not uncommon), etc etc.

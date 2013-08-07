HabitRPG Mobile
===============

HabitRPG mobile application under development. Built using Angular + PhoneGap.

#Installation

##Install HabitRPG Server (`apiv2` branch)
This is a completely separate project, but the server needs to be running for the mobil app to connect to. See
installation instructions at https://github.com/lefnire/habitrpg/wiki/Running-Locally, be sure to checkout the #apiv2
branch instead of #develop or #master

##Install the mobile app
 * Install Node
 * `npm install -g yo generator-angular grunt-cli bower`
 * `npm install && bower install`
 * `grunt server`
 * Run the Ripple Emulator in your browser open browser at http://localhost:9000
   * turn tooltips off
   * disable cross domain proxy
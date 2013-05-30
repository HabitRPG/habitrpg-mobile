HabitRPG Mobile
===============

HabitRPG mobile application under development. Built using Angular + PhoneGap.

#Installation
 * Install Node
 * `npm install -g yo grunt-cli bower`
 * `npm install && bower install`
 * `git submodule update --recursive`
 * add your uuid and apiToken in authCtrl.js lines 19-20
 * `node server.js`
 * Run the Ripple Emulator in your browser open browser at http://localhost:3003
   * turn tooltips off
   * disable cross domain proxy
   * run `localStorage.clear()` in your browser console.
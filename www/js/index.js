/* Possibly necessary stuff for Angular + Cordova. See:
 * 1) https://github.com/hollyschinsky/MyAngularPhoneGapProject/tree/master/www
 * 2) http://stackoverflow.com/questions/15105910/angular-ng-view-routing-not-working-in-phonegap
 * They differ, so we may need dto consolidate some stuff?
 */

document.addEventListener('backbutton', function(event) {
	event.preventDefault()
})
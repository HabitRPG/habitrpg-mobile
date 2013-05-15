/**
 * Lightning Touch makes links responsive without the several
 * hundred millisecond delay typical in a hendheld touchscreen browser.
 * 
 * Click events can take 300 ms or so to register on a mobile device because 
 * the device is waiting to see if it's a double click or a touch-and-drag 
 * event.  Use touchStart etc. to work around this issue, but it's not as 
 * straightforward as one might hope.
 * 
 * This code started with a portion of fastButtons created and shared by Google
 * and used according to terms described in the Creative Commons 3.0 Attribution
 * License.  fastButtons can be found at: 
 * http://code.google.com/mobile/articles/fast_buttons.html
 *
 * @module Lightning Touch
 * @author Rich Trott
 * @copyright Copyright (c) 2012 UC Regents
 * @version 1.0.1
 */

/*global document: false, history: false, location: false, window: false */

(function () {
    "use strict";
    var link = [],
        states = [],
        indexToUrl = [],
        defaultTargetId,
        LightningTouch,
        setState,
        saveState,
        getState,
        hideArray,
        coordinates,
        pop,
        preventGhostClick,
        clickBust,
        init;

    coordinates = [];

    pop = function () {
        coordinates.splice(0, 2);
    };

    preventGhostClick = function (x, y) {
        coordinates.push(x, y);
        window.setTimeout(pop, 2500);
    };

    clickBust = function (event) {
        var i, x, y;
        for (i = 0; i < coordinates.length; i += 2) {
            x = coordinates[i];
            y = coordinates[i + 1];
            if (Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };
    document.addEventListener('click', clickBust, true);

    LightningTouch = function (element, handler) {
        this.element = element;
        this.handler = handler;

        element.addEventListener('touchstart', this, false);
        element.addEventListener('click', this, false);
    };

    LightningTouch.prototype.handleEvent = function (event) {
        switch (event.type) {
        case 'touchstart':
            this.onTouchStart(event);
            break;
        case 'touchmove':
            this.onTouchMove(event);
            break;
        case 'touchend':
            this.onClick(event);
            break;
        case 'click':
            this.onClick(event);
            break;
        }
    };

    LightningTouch.prototype.onTouchStart = function (event) {
        event.stopPropagation();

        this.element.addEventListener('touchend', this, false);
        document.body.addEventListener('touchmove', this, false);

        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
    };

    LightningTouch.prototype.onTouchMove = function (event) {
        if (Math.abs(event.touches[0].clientX - this.startX) > 10 ||
                Math.abs(event.touches[0].clientY - this.startY) > 10) {
            this.reset();
        }
    };

    LightningTouch.prototype.onClick = function (event) {
        event.stopPropagation();
        this.reset();
        this.handler(event);

        if (event.type === 'touchend') {
            preventGhostClick(this.startX, this.startY);
        }
    };

    LightningTouch.prototype.reset = function () {
        this.element.removeEventListener('touchend', this, false);
        document.body.removeEventListener('touchmove', this, false);
    };

    setState = function (object, url) {
        var index = indexToUrl.indexOf(url);
        if (index < 0) {
            index = indexToUrl.length;
            indexToUrl.push(url);
        }
        states[index] = object;
    };

    saveState = function (object, title, url) {
        url = url || location.pathname + location.hash;
        setState(object, url);
        history.replaceState(object, title, url);
    };

    getState = function (id) {
        var url = id ? location.pathname + '#/' + id : location.pathname + location.hash,
            index = indexToUrl.indexOf(url);
        return index < 0 ? undefined : states[index];
    };

    hideArray = function (hide, newHideId) {
        if (hide.indexOf(newHideId) < 0) {
            hide.push(newHideId);
        }
        return hide;
    };

    init = function () {
        var anchors, i, touchHandler, popHandler;

        defaultTargetId = document.body.getAttribute('data-default-target-id') || '';

        function showContent(show, hide) {
            var hideElement, showElement, i;

            showElement = document.getElementById(show) || document.getElementById(defaultTargetId);
            if (showElement) {
                for (i = 0; i < hide.length; i += 1) {
                    hideElement = document.getElementById(hide[i]);
                    if (hideElement) {
                        hideElement.setAttribute("style", "display:none");
                    }
                }
                showElement.setAttribute("style", "display:block");
            }
        }

        if ((!location.hash) && (defaultTargetId !== '')) {
            location.hash = '#/' + defaultTargetId;
        }
        showContent(location.hash.substring(2), [defaultTargetId]);

        if (!(history instanceof Object && history.replaceState instanceof Function)) {
            return;
        }

        touchHandler = function (event) {
            var targetId, target, clickedNode, clickedNodeId, state, hide;
            targetId = this.element.getAttribute("data-target-id");
            target = document.getElementById(targetId);
            if (target !== null) {
                event.preventDefault();
                clickedNode = document.getElementById(location.hash.substr(2));
                clickedNodeId = clickedNode ? clickedNode.getAttribute('id') : defaultTargetId;
                showContent(targetId, [clickedNodeId]);

                state = getState();
                hide = (state && state.hasOwnProperty('hide')) ?
                        hideArray(state.hide, targetId) :
                        [targetId];

                saveState({
                    show: clickedNodeId,
                    hide: hide
                }, '');

                location.hash = '#/' + targetId;

                state = getState();
                hide = (state && state.hasOwnProperty('hide')) ?
                        hideArray(state.hide, clickedNodeId) :
                        [clickedNodeId];

                saveState({
                    show: targetId,
                    hide: hide
                }, '');
            }
        };

        anchors = document.getElementsByTagName("a");
        for (i = 0; i < anchors.length; i += 1) {
            if (anchors[i].getAttribute('data-target-id') !== null) {
                link.push(new LightningTouch(anchors[i], touchHandler));
            }
        }

        popHandler = function (event) {
            var state, previousState, hide;
            state = getState();
            if (state) {
                showContent(state.show, state.hide);
            }
            if (event.state && event.state.hide) {
                //Retrieve adjacent pages and add our "show" value to their hide values
                for (i = 0; i < event.state.hide.length; i += 1) {
                    previousState = getState(event.state.hide[i]);
                    if (previousState) {
                        hide = hideArray(previousState.hide, event.state.show);
                        setState({
                            show: event.state.hide[i],
                            hide: hide
                        }, location.pathname + '#/' + event.state.hide[i]);
                    }
                }
                showContent(event.state.show, event.state.hide);
            }
        };
        window.addEventListener("popstate", popHandler, false);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init, false);
    }
}());
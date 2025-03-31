// ==UserScript==
// @name         block ads
// @namespace    http://tampermonkey.net/
// @version      2025-03-31
// @description  peace of mind
// @author       You
// @match        https://x.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function handleScroll() {
        document.querySelectorAll('[data-testid="placementTracking"]').forEach(el => el.remove());
    }

    window.addEventListener('scroll', handleScroll);

    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', handleScroll);
    });

})();

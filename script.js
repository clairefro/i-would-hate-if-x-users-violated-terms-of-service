// ==UserScript==
// @name         X ad collapser
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Collapses ads with option to expand
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // external link SVG used by X for ads mainly
    const SVG_PATH_D = "M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z";

    GM_addStyle(`
        .tm-collapsed-ad {
            max-height: 60px !important;
            overflow: hidden !important;
            position: relative !important;
            opacity: 1 !important;
            margin-bottom: 0 !important;
            pointer-events: auto;
        }
        .tm-collapsed-ad::after {
            content: "Sponsored (hover to expand)" !important; /* don't know why X doesn't respect click event */
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,1)) !important;
            padding: 15px 10px 5px 10px !important;
            font-size: 12px !important;
            color: #000 !important;
            text-align: center !important;
            font-weight: bold !important;
            z-index: 1 !important;
            pointer-events: none !important;
        }
        .tm-expander {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 40px !important;
            z-index: 2 !important;
            cursor: pointer !important;
            background: transparent !important;
            border: none !important;
            pointer-events: auto !important;
        }
    `);

    let debounceTimer = null;

    function hasMatchingSvg(element) {
        return [...element.querySelectorAll('[data-testid="placementTracking"] svg path')].some(path => path.getAttribute("d") === SVG_PATH_D);
    }

    function processAds() {
        document.querySelectorAll('article:not(.tm-processed)')
            .forEach(el => {
                if (!hasMatchingSvg(el)) return;

                el.classList.add('tm-collapsed-ad', 'tm-processed');

                const expander = document.createElement('button');
                expander.className = 'tm-expander';
                expander.addEventListener('click', (e) => {
                    // for whatever reason, X doesn't care this is a click event.... triggers on hover
                    e.preventDefault();
                    e.stopPropagation();
                    el.classList.remove('tm-collapsed-ad');
                    expander.remove();
                });
                el.appendChild(expander);
            });
    }

    function handleScroll() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processAds, 100);
    }

    processAds();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', () => window.removeEventListener('scroll', handleScroll));
})();

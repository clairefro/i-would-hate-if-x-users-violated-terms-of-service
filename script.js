// ==UserScript==
// @name         X Ad Collapser (Some languages)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Collapses ads and ONLY expands on explicit click
// @author       You
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.twitter.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .tm-collapsed-ad {
            max-height: 80px !important;
            overflow: hidden !important;
            position: relative !important;
            opacity: 0.7 !important;
            border-left: 4px solid #ff9000 !important;
            margin-bottom: 8px !important;
        }
        .tm-collapsed-ad::after {
            content: "Sponsored (click to expand)" !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0.9)) !important;
            padding: 15px 10px 5px 10px !important;
            font-size: 12px !important;
            color: #555 !important;
            text-align: center !important;
            font-weight: bold !important;
            z-index: 1 !important;
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
        }
    `);

    let debounceTimer = null;

    function isAd(element) {
        const adIndicators = ["Promoted", "プロモーション", "Promoción", "Promo", "Sponsorisé"];
        return (
            element.querySelector('[data-testid="placementTracking"]') ||
            adIndicators.some(indicator => element.textContent.includes(indicator))
        );
    }

    function hasMedia(element) {
        return element.querySelector('[data-testid="tweetPhoto"], [data-testid="tweetVideo"]');
    }

    function processAds() {
        document.querySelectorAll('article:not(.tm-processed)').forEach(el => {
            if (!isAd(el) || hasMedia(el)) return;

            el.classList.add('tm-collapsed-ad', 'tm-processed');

            // Add dedicated click button
            const expander = document.createElement('button');
            expander.className = 'tm-expander';
            expander.addEventListener('click', (e) => {
                e.stopPropagation();
                el.classList.remove('tm-collapsed-ad');
                expander.remove();
            });
            el.appendChild(expander);
        });
    }

    function handleScroll() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processAds, 200);
    }

    // Initial run
    processAds();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('scroll', handleScroll);
    });
})();

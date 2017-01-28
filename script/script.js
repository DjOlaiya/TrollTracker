// ==UserScript==
// @name         Tweet Square Adder Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://twitter.com/realdonaldtrump
// @grant        none
// @require https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('p.tweet-text', filter);

    // Your code here...
    function filter (tweet) {
        console.log(tweet);
        tweet.context.innerHTML = 'Poop';
        var square = document.createElement('div');
        square.style.width = '16px';
        square.style.height = '16px';
        square.style.background = 'red';
        tweet.context.appendChild(square);
    }

})();
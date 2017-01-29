// ==UserScript==
// @name         Tweet Square Adder Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description
// @author       You
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('p.tweet-text', filter);

    // Your code here...
    function filter (tweet) {
        var resp = [];
        //console.log(tweet);
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://localhost:50007/" + tweet.context.innerText,
            onload: function(response) {
                resp = response.responseText.split(",");
                console.log(response.responseText);

                var val = resp[1] * 50 + (resp[0] == 'True' ? 50 : 0);
                var r,g,b;
                console.log(resp);
                console.log(val);
                if (val <= 50)
                {
                    r = Math.floor((255 * (val / 50)));
                    g = 255;
                    b = Math.floor((255 * (val / 50)));
                }
                else
                {
                    r = 255;
                    g = Math.floor((100 - val) / 50 * 255);
                    b = Math.floor((100 - val) / 50 * 255);
                }

                var square = document.createElement('div');
                //square.style.width = '16px';
                //square.style.height = '16px';
                console.log('rgb(' + r + ',' + g + ',' + b + ')');
                square.style.background = 'rgb(' + r + ',' + g + ',' + b + ')';
                square.innerText = resp[1] + (resp[0] == 'True' ? '!!!' : '');
                tweet.context.appendChild(square);
            }
        });

    }

})();
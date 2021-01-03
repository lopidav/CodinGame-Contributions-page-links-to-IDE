// ==UserScript==
// @name         CodinGame Contributions page links to IDE
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When you click on contribution on www.codingame.com/contribute/community* page it'll get you straight to the test in IDE page
// @author       lopidav
// @match        https://www.codingame.com/*
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function(XHR) {
    const {open, send} = XHR;
    XHR.open = function(method, url) {
        this.addEventListener('readystatechange', () => {
            if(this.readyState == 4 && this.responseURL.includes('getAllPendingContributions')) {
                let data = JSON.parse(this.response);
                data.forEach((contribution) => {
                    if (
                        contribution.status == "PENDING"
                        && contribution.type == "CLASHOFCODE"
                        //&& contribution.readyForModeration == true
                    ) {
                        fetch('services/Contribution/startPreview', {method: 'POST', body: `[${contribution.publicHandle},${contribution.activeVersion}]`})
                            .then(r => r.json())
                            .then(d => {
                            let newHref = `/ide/demo/${d}`;
                            $(`a.cg-contribution-card[href="/contribute/view/${contribution.publicHandle}"]`).each(function() {
                                let clone = this.cloneNode(false);
                                while (this.hasChildNodes()) clone.appendChild(this.firstChild);
                                this.parentNode.replaceChild(clone, this);
                                clone.href = newHref;
                            });
                        });
                    }
                });
            }
        });
        open.apply(this, arguments);
    }
})(XMLHttpRequest.prototype);

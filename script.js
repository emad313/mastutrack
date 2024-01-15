/**
 * Mastutrack JavaScript SDK v1.0.0
 * Author: Emad Uddin
 * Date: 2023-26-11
 * Description: A JavaScript SDK to track user activity on the website.
 */
// Create a namespace for the SDK
var Mastutrack = Mastutrack || {};
// Variables for the SDK to use
var apiKey = null;
var get_details_url = "http://localhost:8080/api/v1/get_details";
var track_url = "http://localhost:8080/api/v1/track";
var get_details = {};
var ref_id_list = ["pat_ref", "pat", "via", "ref", "p", "from", "by", "deal", "go", "get"];
var event = false;
// create a constructor for the SDK
Mastutrack = function () {

};
// Create a function to initialize the SDK
Mastutrack.prototype.initialize = function ({
    apiKey = null,
    event = false,
}) {
    this.apiKey = apiKey;
    this.event = event;
    this._callFunctions(apiKey);
};
// Function to all the functions
Mastutrack.prototype._callFunctions = function (apiKey) {
    if(apiKey != null && apiKey != "" && apiKey != undefined 
    && this._checkUrlParams() != undefined
    && this._checkUrlParams().ref_id != undefined 
    && this._checkUrlParams().ref_id != "" 
    && this._checkUrlParams().ref_id != null
    && this._checkUrlParams().ref_id_type != undefined
    && this._checkUrlParams().ref_id_type != ""
    && this._checkUrlParams().ref_id_type != null) {
        if(this._checkCookie(apiKey)) {
            if(this._checkCookieLifetime(apiKey)) {
                // Send data to the server
            } else {
                this._setCookie(apiKey);
            }
        } else {
            this._setCookie(apiKey);
        }
    }
    if (apiKey != null && apiKey != "" && apiKey != undefined ) {
        this._trackPageView();
        if (this.event) {
            this._trackEvent();
        }
    }
};
// Set the cookie
Mastutrack.prototype._setCookie = function (apiKey) {
    var data = this._getData(this.get_details_url, apiKey);
            if (this._isEmpty(data) == false) {
                var params = this._checkUrlParams();
                var cookie_value = {
                    campaign_name: data.campaign_name,
                    ref_id: params.ref_id,
                    ref_id_type: params.ref_id_type,
                    cookie_lifetime: data.cookie_lifetime,
                    domain: data.domain,
                    webhook: data.webhooks,
                };
                var domain = data.domain ? data.domain : window.location.hostname;
                this._createCookie(apiKey, JSON.stringify(cookie_value), data.cookie_lifetime, domain);
}
};
// Check url parameters for referer id and tid
Mastutrack.prototype._checkUrlParams = function () {
    var urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < ref_id_list.length; i++) {
        if (urlParams.has(ref_id_list[i]) && urlParams.get(ref_id_list[i]) != "") {
            return {
                ref_id: urlParams.get(ref_id_list[i]),
                ref_id_type: ref_id_list[i],
            };
            };
        }
    }
// Get Data from the server
Mastutrack.prototype._getData = function (url, apiKey) {
    // var xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == XMLHttpRequest.DONE) {
    //         return JSON.parse(xhr.responseText);
    //     }
    // };
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.send(JSON.stringify({apiKey: apiKey}));
    return {
        campaign_name: "Campaign One",
        domain: "mastutrack.com",
        cookie_lifetime: 60,
        description: "test description",
        webhooks: [],
    };
};

// Check empty object
Mastutrack.prototype._isEmpty = function (obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
};

var cookie = {
    write: function (name, value, days, domain, path) {
        var date = new Date();
        days = days || 60; // Default at 60 days
        path = path || '/';
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
        var cookieValue = name + '=' + value + expires + '; path=' + path;
        if (domain) {
            cookieValue += '; domain=' + domain;
        }
        document.cookie = cookieValue;
    },
    read: function (name) {
        var allCookie = '' + document.cookie;
        var index = allCookie.indexOf(name);
        if (name === undefined || name === '' || index === -1) return '';
        var ind1 = allCookie.indexOf(';', index);
        if (ind1 == -1) ind1 = allCookie.length;
        // decodeURI instead of unescape for utf-8 encoding
        return unescape(allCookie.substring(index + name.length + 1, ind1));
    },
    remove: function (name) {
        if (this.read(name)) {
            this.write(name, '', -1, '/');
        }
    }
};
// Check if the cookie exists with name and value
Mastutrack.prototype._checkCookie = function (cookie_name) {
    if (cookie.read(cookie_name)) {
        return true;
    }
    return false;
};
// Check Cookie Lifetime
Mastutrack.prototype._checkCookieLifetime = function (cookie_name) {
    var value = JSON.parse(cookie.read(cookie_name));
    if (new Date.parse(value.expires) < new Date()) {
        cookie.remove(cookie_name);
        return true;
    } else {
        return false;
    }
};

// Create a function to create a cookie
Mastutrack.prototype._createCookie = function (cookie_name, cookie_value, cookie_days, domain) {
    cookie.write(cookie_name, cookie_value, cookie_days, domain);
    return true;
};

// Send data to the server using XMLHttpRequest object and POST method
Mastutrack.prototype._sendData = function (data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", this.track_url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        apiKey: this.apiKey,
        data: data,
    }));
};

// Function to track the page view and send data to the server
Mastutrack.prototype._trackPageView = function () {
    var data = {
        type: "pageview",
        data: {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language
        },
    };
    console.log(data);
    // this._sendData(data);
};

// Function to track the event and send data to the server
Mastutrack.prototype._trackEvent = function () {
    window.onclick = function(e) {
        if (e.target.tagName == "A") {
            var data = {
                type: "event",
                data: {
                    category: "link",
                    action: "click",
                    label: e.target.href,
                    value: 1,
                },
            };
            console.log(data);
            // this._sendData(data);
        }
    };
};

// Send data to the server if buy any product from the website
Mastutrack.prototype._trackPurchase = function () {
    var data = {
        type: "purchase",
        data: {
            category: "ecommerce",
            action: "purchase",
            label: "purchase",
            value: 1,
        },
    };
    console.log(data);
    // this._sendData(data);
};

// Send data to the server if add to cart any product from the website
Mastutrack.prototype._trackAddToCart = function () {
    var data = {
        type: "add_to_cart",
        data: {
            category: "ecommerce",
            action: "add_to_cart",
            label: "add_to_cart",
            value: 1,
        },
    };
    console.log(data);
    // this._sendData(data);
};

// Send data to the server if remove from cart any product from the website
// Mastutrack.prototype._trackRemoveFromCart = function () {
//     var data = {
//         type: "remove_from_cart",
//         data: {
//             category: "ecommerce",
//             action: "remove_from_cart",
//             label: "remove_from_cart",
//             value: 1,
//         },
//     };
//     console.log(data);
//     // this._sendData(data);
// };
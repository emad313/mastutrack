/**
 * Mastutrack JavaScript SDK v1.0.0
 * Author: Emad Uddin
 * Date: 2023-26-11
 * Description: A JavaScript SDK to track user activity on the website.
 */
// Create a namespace for the SDK
var Mastutrack = Mastutrack || {};
// Variables for the SDK to use
var apiKey = "null";
var get_details_url = "http://localhost:8080/api/v1/get_details";
var track_url = "http://localhost:8080/api/v1/track";
var get_details = {};
// create a constructor for the SDK
Mastutrack = function () {
    console.log("Mastutrack initialized");
};
// Create a function to initialize the SDK
Mastutrack.prototype.initialize = function ({
    apiKey = 'null',
}) {
    this.apiKey = apiKey;
    this._getData(get_details_url, this.apiKey);
    this._createCookie();
};
// Get Data from the server
Mastutrack.prototype._getData = function (url, apiKey) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json", "Authorization", "Bearer " + apiKey);
    xhr.send();
    this.get_details = JSON.parse(xhr.responseText);
};

var cookie = {
    write: function(name, value, days, domain, path) {
        var date = new Date();
        days = days || 730; // two years
        path = path || '/';
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
        var cookieValue = name + '=' + value + expires + '; path=' + path;
        if (domain) {
            cookieValue += '; domain=' + domain;
        }
        document.cookie = cookieValue;
    },
    read: function(name) {
        var allCookie = '' + document.cookie;
        var index = allCookie.indexOf(name);
        if (name === undefined || name === '' || index === -1) return '';
        var ind1 = allCookie.indexOf(';', index);
        if (ind1 == -1) ind1 = allCookie.length;
        return unescape(allCookie.substring(index + name.length + 1, ind1));
    },
    remove: function(name) {
        if (this.read(name)) {
            this.write(name, '', -1, '/');
        }
    }
};

// 
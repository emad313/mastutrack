// Create Javascript SDK for the website tracking and analytics

// (function (window) {

    // Create a constructor for the Mastutrack object
    var Mastutrack = function () {
        this._initialize();
    };

    // Initialize the SDK
    Mastutrack.prototype._initialize = function () {
        // this._createCookie();
        console.log("Mastutrack initialized");
    };

    // Create a cookie for the user
    Mastutrack.prototype._createCookie = function () {
        var cookie = document.cookie;
        if (cookie.indexOf("mastu=") == -1) {
            var date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + date.toUTCString();
            var cookieValue = "mastu=" + this._generateUUID() + ";" + expires + ";path=/";
            document.cookie = cookieValue;
        }
    };

    // Generate a UUID for the user
    Mastutrack.prototype._generateUUID = function () {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    // Create a function to send data to the server
    Mastutrack.prototype._sendData = function (data) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/api/v1/track", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    };

    // Create a function to track the page view
    Mastutrack.prototype.trackPageView = function () {
        var data = {
            "type": "pageview",
            "data": {
                "url": window.location.href,
                "title": document.title,
                "referrer": document.referrer,
                "userAgent": navigator.userAgent,
                "language": navigator.language,
                "cookie": document.cookie
            }
        };
        this._sendData(data);
    }

    // Create a function to track the event
    Mastutrack.prototype.trackEvent = function (category, action, label, value) {
        var data = {
            "type": "event",
            "data": {
                "category": category,
                "action": action,
                "label": label,
                "value": value
            }
        };
        this._sendData(data);
    }

// })();
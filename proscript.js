var Mastutrack = Mastutrack || {};

var _aid = null;
var _event = 'visit';
var _get_details_url = "http://localhost:8000/api/tracker/v1/get-data";
var _track_url = "http://localhost:8000/api/tracker/v1/track-visit";
var _get_details = {};
var _ref_id_list = ["pat_ref", "pat", "via", "ref", "p", "from", "by", "deal", "go", "get"];
var _pat_ref_id = '_pat_ref_id';
var _pat_track_id = '_pat_track_id';
var _pat_details = '_pat_details';

Mastutrack = function () {

};

Mastutrack.prototype._init = function ({
    aid = null,
    event = 'visit',
}) {
    _aid = aid;
    _event = event;
    this._callFunctions(aid);
};

Mastutrack.prototype._callFunctions = function (aid) {
    if (aid != null && aid != "" && aid != undefined
        && this._checkUrlParams() != undefined
        && this._checkUrlParams().ref_id != undefined
        && this._checkUrlParams().ref_id != ""
        && this._checkUrlParams().ref_id != null
        && this._checkUrlParams().ref_id_type != undefined
        && this._checkUrlParams().ref_id_type != ""
        && this._checkUrlParams().ref_id_type != null) {
        if (this._checkCookie(aid)) {
            // if (this._checkCookieLifetime(aid)) {
            //     // Send data to the server
            // } else {
            //     this._setCookie(aid);
            // }
        } else {
            // this._setCookie(aid);
        }
    }
    // if (aid != null && aid != "" && aid != undefined) {
    //     this._trackPageView();
    //     if (_event) {
    //         this._trackEvent();
    //     }
    // }
};

Mastutrack.prototype._checkUrlParams = function () {
    var urlParams = new URLSearchParams(window.location.search);
    for (var i = 0; i < _ref_id_list.length; i++) {
        if (urlParams.has(_ref_id_list[i]) && urlParams.get(_ref_id_list[i]) != "") {
            return {
                ref_id: urlParams.get(_ref_id_list[i]),
                ref_id_type: _ref_id_list[i],
            };
        };
    }
};

Mastutrack.prototype._checkCookie = function (aid) {
    var cookie = this._getCookie(aid);
    if (cookie != null && cookie != "" && cookie != undefined) {
        return true;
    }
    return false;
}

Mastutrack.prototype._getCookie = function (aid) {
    var name = aid + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return null;
}

Mastutrack.prototype._setCookie = function (aid) {
    var data = this._getData(_get_details_url, aid);
    if (this._isEmpty(data) == false) {
        var params = this._checkUrlParams();
        var cookie_value = {
            campaign_name: data.campaign_name,
            ref_id: params.ref_id,
            ref_id_type: params.ref_id_type,
            cookie_lifetime: data.cookie_lifetime,
            cookie_created_at: new Date().getTime(),
            cookie_updated_at: new Date().getTime(),
        };
        this._createCookie(aid, cookie_value, data.cookie_lifetime);
    }
}

Mastutrack.prototype._getData = function (url, aid) {
    var data = {};
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url + "?aid=" + aid, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
    return data;
}



Mastutrack.prototype._checkCookieLifetime = function (aid) {
    var cookie = this._getCookie(aid);
    var cookie_lifetime = cookie.cookie_lifetime;
    var cookie_created_at = cookie.cookie_created_at;
    var cookie_updated_at = cookie.cookie_updated_at;
    var current_time = new Date().getTime();
    if (current_time - cookie_updated_at > cookie_lifetime) {
        return false;
    }
    return true;
}

Mastutrack.prototype._createCookie = function (aid, cookie_value, cookie_lifetime) {
    var d = new Date();
    d.setTime(d.getTime() + (cookie_lifetime * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = aid + "=" + JSON.stringify(cookie_value) + ";" + expires + ";path=/";
}



Mastutrack.prototype._trackPageView = function () {
    var cookie = this._getCookie(_aid);
    var data = {
        aid: _aid,
        campaign_name: cookie.campaign_name,
        ref_id: cookie.ref_id,
        ref_id_type: cookie.ref_id_type,
        event: 'visit',
        url: window.location.href,
        title: document.title,
        domain: window.location.hostname,
        path: window.location.pathname,
        query_string: window.location.search,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        cookie_lifetime: cookie.cookie_lifetime,
        cookie_created_at: cookie.cookie_created_at,
        cookie_updated_at: cookie.cookie_updated_at,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _track_url, false);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

window.Mastutrack = new Mastutrack();
var Mastutrack = Mastutrack || {};

var _aid = null;
var _state = 'visit';
var _get_details_url = "http://localhost:8000/api/tracker/v1/get-data";
var _track_url = "http://localhost:8000/api/tracker/v1/track-visit";
var _track_lead = "http://localhost:8000/api/tracker/v1/track-signup";
var _track_sale = "http://localhost:8000/api/tracker/v1/track-sale";
var _get_details = {};
var _ref_id_list = ["pat_ref", "pat", "via", "ref", "p", "from", "by", "deal", "go", "get"];
var _pat_ref_id = '_pat_ref_id';
var _pat_track_id = '_pat_track_id';
var _pat_details = '_pat_details';
var _pat_page_url = window.location.href;
var _pat_referrer = document.referrer == "" ? '/' : document.referrer;
var _origin = window.location.origin;

Mastutrack = function () {

};

Mastutrack.prototype._init = function ({
    aid = null,
    state = 'visit',
}) {
    _aid = aid;
    _state = state;

    this._callFunctions(aid);
};

Mastutrack.prototype._callFunctions = function (aid) {
    if (this._isNotEmpty(aid) && this._isNotEmpty(this._checkUrlParams())
        && this._isNotEmpty(this._checkUrlParams().ref_id) && this._isNotEmpty(this._checkUrlParams().ref_id_type)) {
        if (this._checkCookie(_pat_ref_id) && this._checkCookie(_pat_track_id)) {
            if (this._checkUrlParams().ref_id !== this._getCookie(_pat_ref_id)) {
                this._trackPageView();
            } else {
                // If cookie are same then check cookie life time and update cookie
            }
        } else {
            this._trackPageView()
        }
    }
};

Mastutrack.prototype.lead = function ({
    email = null,
    uid = null,
    plan = null,
    affiliate_code = null,
    track_id = null,
}) {
    if (this._isNotEmpty(email) || this._isNotEmpty(uid)) {
        if (this._checkCookie(_pat_ref_id) && this._checkCookie(_pat_track_id)){
            this._trackLead(email, uid, plan);
        }else{
            if (this._isNotEmpty(affiliate_code) || this._isNotEmpty(track_id)) {
                this._trackLead(email, uid, plan, affiliate_code, track_id);
            }
        }
    }
};

Mastutrack.prototype.sale = function ({
    email = null,
    uid = null,
    plan = null,
    affiliate_code = null,
    track_id = null,
    amount = null,
    event = null,
    quantity = null,
}){
    if ((this._isNotEmpty(email) || this._isNotEmpty(uid)) && this._isNotEmpty(amount) && this._isNotEmpty(event)) {
        if (this._checkCookie(_pat_ref_id) && this._checkCookie(_pat_track_id)) {
            this._trackSale(email, uid, plan, null, null, amount, event, quantity);
        }else{
            if(this._isNotEmpty(affiliate_code) || this._isNotEmpty(track_id)) {
                this._trackSale(email, uid, plan, affiliate_code, track_id, amount, event, quantity);
            }
        }
    }

};

// Variable check function if empty or not null or undefined
Mastutrack.prototype._isNotEmpty = function (variable) {
    return ((variable != null && variable != "" && variable != undefined) ? true : false);
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
    return undefined;
};

Mastutrack.prototype._setCookie = function (cName, cookie_value, cookie_lifetime) {
    const d = new Date();
    d.setTime(d.getTime() + (cookie_lifetime * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cName + "=" + cookie_value + ";" + expires + ";path=/";
}

Mastutrack.prototype._getCookie = function (cName) {
    // var name = cName + "=";
    // var decodedCookie = decodeURIComponent(document.cookie);
    // var ca = decodedCookie.split(';');
    // for (var i = 0; i < ca.length; i++) {
    //     var c = ca[i];
    //     while (c.charAt(0) == ' ') {
    //         c = c.substring(1);
    //     }
    //     if (c.indexOf(name) == 0) {
    //         return c.substring(name.length, c.length);
    //     }
    // }
    // return null;
    return 'hello9693'
}

Mastutrack.prototype._checkCookie = function (cName) {
    // var cookie = this._getCookie(cName);
    // if (cookie != null && cookie != "" && cookie != undefined) {
        return true;
    // }
    // return false;
}

Mastutrack.prototype._deleteCookie = function (cName) {
    document.cookie = cName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

Mastutrack.prototype._trackIdGenerator = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (this._getCookie(_pat_track_id) == text) {
        this._trackIdGenerator();
    }
    return text;
}

Mastutrack.prototype._trackPageView = function () {
    var bodyData = {
        account_id: _aid,
        affiliate_code: this._checkUrlParams().ref_id,
        track_id: this._trackIdGenerator(),
        page_url: _pat_page_url,
        refferrer_url: _pat_referrer,
        domain: _origin,
        state: _state,
        cookie_ref_id: this._getCookie(_pat_ref_id),
        cookie_track_id: this._getCookie(_pat_track_id),
    };
    let _this = this;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _track_url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(bodyData));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var response = JSON.parse(xhr.responseText).data;
            // Set Cookies function here
            if (_this._checkCookie(_pat_ref_id) && _this._checkCookie(_pat_track_id)) {
                _this._deleteCookie(_pat_ref_id);
                _this._deleteCookie(_pat_track_id);
            }
            _this._setCookie(_pat_ref_id, response.affiliate_code, response.cookie_lifetime);
            _this._setCookie(_pat_track_id, response.track_id, response.cookie_lifetime);
        }
    }
}

Mastutrack.prototype._trackLead = function (customer_email, customer_uid, plan, affiliate_code = null, track_id = null) {
    var bodyData = {
        account_id: _aid,
        affiliate_code: affiliate_code == null ? this._getCookie(_pat_ref_id) : affiliate_code,
        track_id: track_id == null ? this._getCookie(_pat_track_id) : track_id,
        page_url: _pat_page_url,
        refferrer_url: _pat_referrer,
        customer_email: customer_email,
        customer_uid: customer_uid,
        plan: plan,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _track_lead, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(bodyData));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }
}

Mastutrack.prototype._trackSale = function (customer_email, customer_uid, plan, 
    affiliate_code = null, 
    track_id = null, 
    amount, 
    event, 
    quantity = null){
    var bodyData = {
        account_id: _aid,
        affiliate_code: affiliate_code == null ? this._getCookie(_pat_ref_id) : affiliate_code,
        track_id: track_id == null ? this._getCookie(_pat_track_id) : track_id,
        customer_email: customer_email,
        customer_uid: customer_uid,
        plan: plan,
        amount: Number(amount).toFixed(2),
        event: event,
        quantity: quantity,
    };
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _track_sale, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(bodyData));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }

}

window.Mastutrack = new Mastutrack();
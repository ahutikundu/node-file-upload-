
"use strict";
// var encryptLaravel5 = require('encrypt-laravel-5');
// var moment = require('moment-timezone');
// var request = require('request');
// var axios = require('axios');
// var constants = require("/home/ubuntu/config/constants");
// var messages = require("/home/ubuntu/config/messages");
// var _ = require('underscore');
// var _s = require("underscore.string");
const fs = require("fs");
const { promisify } = require('util');
// var crypto = require('crypto');
// var CryptoJS = require("crypto-js");
// var PHPUnserialize = require('php-unserialize');
const path = require('path');
// var dbquery = require("./query");





var utility = exports;

exports.array_flatten = items => {
    var data = [];
    for (let i in items) {
        let item = items[i];
        if (typeof item == 'number') {
            data.push(item)
        }
        if ((typeof item == 'object')) {
            for (let j in item) {
                let _item = item[j];
                data.push(item[j]);
            }
        }
    }
    return data;

}
exports.removeTimeFromDate = d => {
    var t = d;
    if (d.length == 16) {
        t = d.slice(0, (d.length - 5));
    }
    return t;
}
exports.rtrim = (str, chars) => {
    chars = chars || "\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}
exports.storeConfigAll = async () => {
    var configData = {};
    // configData.currency={};
    configData.timezone = {};
    configData.language = {};

    // configData.currency=[
    //     {
    //         "currency_code":"0",
    //         "currency_name":"Select a currency",
    //     },
    //     {
    //         "currency_code":"£",
    //         "currency_name":"Pound",
    //     },
    //     {
    //         "currency_code":"$",
    //         "currency_name":"Dollar",
    //     },


    // ];
    // configData.timezone["0"] = "Select a timezone";
    // configData.timezone["Europe/London"] = "Europe/London";
    // configData.timezone["Canada/Atlantic"] = "Canada/Atlantic";

    configData.timezone = {
        '0': 'Select a timezone',
        'Europe/London': 'Europe/London',
        'Asia/Kolkata': 'Asia/Kolkata',
        'Asia/Karachi': 'Asia/Karachi',
        'Australia/ACT': 'Australia/ACT',
        'Canada/Eastern': 'Canada/Eastern'
    };


    // configData.timezone["Asia/Kolkata"]="Asia/Kolkata";
    configData.language = {
        "0": "Select a language",
        "en": "English",
        "de": "German",
        "fi": "French",
        "es": "Spanish",
    };



    return configData;

}
exports.formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
exports.checkPositiveNumber = (key, number) => {
    let response = {};
    if (number <= 0) {
        response['status'] = "valid_error";
        response['msg'] = "";
        response['errors'] = {};
        response['errors'][`${key}`] = ["Must be postive number"];
        return response;
    }
}

exports.randomNumber = function (length) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
        var sup = Math.floor(Math.random() * possible.length);
        text += i > 0 && sup == i ? "0" : possible.charAt(sup);
    }
    return Number(text);
};
exports.str_random = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.decryptlara2 = function (encrypted) {
    var key = process.env.LARA_Key;
    var cookie = JSON.parse(new Buffer(encrypted, 'base64'));

    var iv = Buffer.from(cookie.iv, 'base64');
    var value = Buffer.from(cookie.value, 'base64');


    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    var dec = Buffer.concat([decipher.update(value), decipher.final()]);
    var sessionId = PHPUnserialize.unserialize(dec);
    // sessionId=Buffer.alloc()

    return sessionId;
};
exports.decryptlara = function (encrypted) {
    return encryptLaravel5.decrypt(encrypted, constants.vals.hash_key);
};
exports.encryptlara = function (payload) {
    return encryptLaravel5.encrypt(payload, constants.vals.hash_key);
};

exports.decryptcipher3 = function (encrypted) {
    const iv = crypto.randomBytes(16)
    var decrypt = crypto.createDecipher('aes256', constants.vals.hash_key, iv);
    var decrypted = decrypt.update(encrypted, 'hex', 'utf8')
    decrypted += decrypt.final();
    return decrypted;
};
exports.encryptcipher3 = function (payload) {
    const iv = crypto.randomBytes(16)
    var encrypt = crypto.createCipheriv('aes256', constants.vals.hash_key, iv);
    var encrypted = encrypt.update(payload, 'utf8', 'hex');
    encrypted += encrypt.final('hex')
    return encrypted;
};


exports.encryptcipher2 = function (text) {

    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(text), constants.vals.encKeys[constants.vals.app_env].h2).toString();
    return ciphertext;
};

exports.decryptcipher2 = function (text) {
    var bytes = CryptoJS.AES.decrypt(text, constants.vals.encKeys[constants.vals.app_env].h2);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};


exports.encryptcipher = function (text) {
    text = text.toString();
    const IV_LENGTH = 16;
    const algorithm = 'aes256';
    let iv = crypto.randomBytes(IV_LENGTH);
    let bfr = Buffer.from(constants.vals.hash_key, 'hex');
    //console.log(Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64'), '323 ', iv, bfr);
    let cipher = crypto.createCipheriv(algorithm, constants.vals.hash_key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decryptcipher = function (text) {
    text = text.toString();
    const IV_LENGTH = 16;
    const algorithm = 'aes256';
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, constants.vals.hash_key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}



exports.base64encode = function (str) {
    let encoded = Buffer.from(str).toString('base64');
    return encoded;
}

exports.checkEmpty = function (mixedVar) {
    var key;
    if (typeof mixedVar == 'object') {
        for (key in mixedVar) {
            //console.log(mixedVar,key);
            if (Object.hasOwnProperty.bind(mixedVar)(key)) {
                //if (mixedVar.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    } else {
        //mixedVar = ""+mixedVar; 
        //if(typeof mixedVar == 'string' || typeof mixedVar == 'number'){
        var undef;

        var i;
        var len;
        var emptyValues = [undef, null, 'null', false, 0, '', '0', '0.00', '0.0', 'empty', undefined, 'undefined'];
        //console.log(mixedVar);
        if (typeof mixedVar == 'string') {
            mixedVar = mixedVar.trim();
        }

        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (mixedVar == emptyValues[i]) {
                return true;
            }
        }
    }
    return false;
};

exports.checkEmptyString = function (mixedVar) {
    var undef;
    var key;
    var i;
    var len;
    var emptyValues = [undef, null, 'null', false, 0, '', '0', '0.00', '0.0', 'empty', undefined, 'undefined'];
    if (typeof mixedVar == 'string') {
        mixedVar = mixedVar.trim();
    }
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar == emptyValues[i]) {
            return true;
        }
    }
    return false;
};

exports.isset = function (obj, key) {

    if (_.has(obj, key)) {
        return true;
    } else {
        return false;
    }

};

exports.number_format = function (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep == 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point == 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE checkFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};

exports.checkInt = function (num) {
    num = parseInt(num);
    if (isNaN(num) || num == "" || num == 0 || num == '0') {
        return 0;
    } else {
        return num;
    }
};

exports.checkFloat = function (num) {
    num = parseFloat(num);
    if (isNaN(num) || num == 0.00 || num == "" || num == 0 || num == '0') {
        return 0.00;
    } else {
        num = utility.formatTotal(num);
        num = parseFloat(num);
        if (isNaN(num) || num == 0.00 || num == "" || num == 0 || num == '0') {
            return 0.00;
        } else {
            return num;
        }
    }
};

exports.formatTotal = function (num) {
    //num = utility.checkFloat(num);
    return utility.number_format(Math.round(num * 100) / 100, 2, '.', '');
};

exports.countItems = function (items) {
    var i = 0;
    var k;

    for (k in items) {
        if (true) {
            i++;
        }
    }
    return i;
};

exports.carbon = {
    now: function (req) {
        return moment().tz(req.locals.tz).format('YYYY-MM-DD HH:mm:ss');
    },
    parse: function (date) {
        return moment.parseZone(date).format('YYYY-MM-DD HH:mm:ss');
    },
    parseZone: function (req, date) {
        return moment.parseZone(date).tz(req.locals.tz).format('YYYY-MM-DD HH:mm:ss');
    },
    yesterday: function (req) {
        return moment().subtract(1, 'days').tz(req.locals.tz).format('YYYY-MM-DD HH:mm:ss');
    },
    tomorrow: function (req) {
        return moment().add(1, 'days').tz(req.locals.tz).format('YYYY-MM-DD HH:mm:ss');
    },
    format: function (date, frmt) {
        return moment.parseZone(date).format(frmt);
    },
    strtotime: function (req, date) {
        return moment(date).tz(req.locals.tz).valueOf() / 1000; //new Date(date).getTime() / 1000;
    },
    isGreater: function (date1, date2) {
        date1 = moment.parseZone(date1);
        date2 = moment.parseZone(date2);
        if (date1 > date2) {
            return true;
        } else {
            return false;
        }
    },
    isGreaterOrEqual: function (date1, date2) {
        date1 = moment.parseZone(date1);
        date2 = moment.parseZone(date2);
        if (date1 >= date2) {
            return true;
        } else {
            return false;
        }
    },
    isLessOrEqual: function (date1, date2) {
        date1 = moment.parseZone(date1);
        date2 = moment.parseZone(date2);
        if (date1 <= date2) {
            return true;
        } else {
            return false;
        }
    },
    addDay: function (date, day) {
        //return  moment.parseZone(date).add(day,'days').tz(req.locals.tz).format('YYYY-MM-DD HH:mm:ss');
        return moment.parseZone(date).add(day, 'days').format('YYYY-MM-DD HH:mm:ss');
    },
    subDay: function (date, day) {
        return moment.parseZone(date).subtract(day, 'days').format('YYYY-MM-DD HH:mm:ss');
    },
    addMinutes: function (date, minutes) {
        return moment.parseZone(date).add(minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    },
    timeDiffernce: (start_time, end_time) => {
        var start_time = start_time.slice(11, 19);
        start_time = start_time.split(':');
        var end_time = end_time.slice(11, 19);
        end_time = end_time.split(':');
        start_time = parseInt(start_time[0]) * 60 * 60 + parseInt(start_time[1]) * 60 + parseInt(start_time[2]);
        end_time = parseInt(end_time[0]) * 60 * 60 + parseInt(end_time[1]) * 60 + parseInt(end_time[2]);
        var due_time = end_time - start_time;
        due_time = Math.floor(due_time / 60);
        return due_time;
    },
    timeDiffernceFormat: (start_time, end_time, format) => {
        start_time = moment.parseZone(start_time);
        end_time = moment.parseZone(end_time);
        var dff = end_time.diff(start_time, format);
        return dff;
    },
    dayNumber: (date) => {
        var days = {
            'Monday': '1',
            'Tuesday': '2',
            'Wednesday': '3',
            'Thursday': '4',
            'Friday': '5',
            'Saturday': '6',
            'Sunday': '7'
        }
        var weekNumber = days[moment(date).format('dddd')];
        return weekNumber;
    },
    dayName: (date) => {
        return moment(date).format('dddd');
    },
    toUtc: function (date) {
        return moment(date).utcOffset('+0000');
    },
    toUtcZone: async function (req, date) {
        return moment(date).utcOffset('+0000');
    },
    dayDiffernce: function (fromdate, todate) {
        let fromDate = moment(fromdate);
        let toDate = moment(todate);
        return toDate.diff( fromDate, 'days' );
    }

};
exports.number_format = function (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep == 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point == 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE checkFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};
exports.convertMinsToHrsMins = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
};
exports.convertHrsMinsToMins = t => {
    var a = t.split(":");
    a = parseInt(a[0]) * 60 + parseInt(a[1]);
    return a;

}
exports.timeInterval = (store_preorder_Time_interval, store_preorder_Open_time, store_preorder_Close_time) => {
    var open_time = utility.convertHrsMinsToMins(store_preorder_Open_time);
    var close_time = utility.convertHrsMinsToMins(store_preorder_Close_time);
    var diff_time = close_time - open_time;
    var diff_time_interval = parseInt(diff_time / store_preorder_Time_interval);
    var newOpenTime = "";
    var time;
    for (let i = 0; i < diff_time_interval + 1; i++) {
        // console.log(i);
        time = store_preorder_Time_interval * i
        //  console.log(time);
        time += open_time;
        // console.log(time);
        time = utility.convertMinsToHrsMins(time);
        //  console.log(time);

        newOpenTime += (i == 0 ? time : "||" + time);


    }
    return newOpenTime
}
exports.timeDiffernce = (start_time, end_time) => {
    var start_time = start_time.slice(11, 19);
    start_time = start_time.split(':');
    var end_time = end_time.slice(11, 19);
    end_time = end_time.split(':');
    start_time = parseInt(start_time[0]) * 60 * 60 + parseInt(start_time[1]) * 60 + parseInt(start_time[2]);
    end_time = parseInt(end_time[0]) * 60 * 60 + parseInt(end_time[1]) * 60 + parseInt(end_time[2]);
    var due_time = end_time - start_time;
    due_time = Math.floor(due_time / 60);
    return due_time;
}


exports.cleanString = function (string) {
    string = string.trim();
    string = string.replace(/ /g, '-');
    string = string.replace(/[^A-Za-z0-9\-]/g, '');
    string = string.replace(/-+/g, '-');
    return string;
};

exports.cleanJunkString = function (string) {
    if (utility.checkEmpty(string)) {
        return '';
    }
    string = string + '';
    string = string.trim();
    string = string.replace(/undefined/g, "");
    string = string.replace(/Undefined/g, "");
    return string;
};

exports.issetNested = function (obj, ...args) {
    return args.reduce((obj, level) => obj && obj[level], obj)
};

exports.createNesteds = function (base, names, value) {
    // If a value is given, remove the last name and keep it for later:
    var lastName = arguments.length === 3 ? names.pop() : false;

    // Walk the hierarchy, creating new objects where needed.
    // If the lastName was removed, then the last object is not set yet:
    for (var i = 0; i < names.length; i++) {
        base = base[names[i]] = base[names[i]] || {};
    }

    // If a value was given, set it to the last name:
    if (lastName) base = base[lastName] = value;

    // Return the last object in the hierarchy:
    return base;
};

exports.createNested = (obj, keys, v) => {
    if (keys.length === 1) {
        obj[keys[0]] = v;
    } else {
        var key = keys.shift();
        obj[key] = utility.createNested(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
    }

    return obj;
};

exports.createNestedArr = (obj, keys, v) => {
    if (keys.length === 1) {
        obj[keys[0]] = v;
    } else {
        var key = keys.shift();
        obj[key] = utility.createNestedArr(typeof obj[key] === 'undefined' ? [] : obj[key], keys, v);
    }

    return obj;
};

//exports.getNested(response, '33', 'r', 'k');

exports.objToPluck = function (obj, key, val) {
    var objarr = {};

    for (var k in obj) {
        if (key == '') {
            objarr[k] = obj[k][val];
        } else {
            objarr[obj[k][key]] = obj[k][val];
        }

    }
    return objarr;
};
exports.objToPluckArr = function (obj, val) {
    var objarr = [];
    for (var k in obj) {
        objarr.push(obj[k][val]);

    }
    return objarr;
};
exports.objToArr = function (obj) {
    var objarr = [];
    for (var k in obj) {
        objarr.push(obj[k]);

    }
    return objarr;
};
exports.objToString = function (obj) {
    var str = Object.keys(obj).map(function (k) { return obj[k] }).join(",");
    return str;
};
exports.prepareObjectForWhereIn = function (obj) {
    var array = [];
    var i = 0;
    for (let key in obj) {
        // array[i]=obj[key];
        array.push(obj[key]);
        i++;
    }
    return array;
};
exports.getRandomObjectKey = function (obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
};

exports.splitIndex = function (input, len) {
    return input.match(new RegExp('.{1,' + len + '}(?=(.{' + len + '})+(?!.))|.{1,' + len + '}$', 'g'));
};
exports.objectNext = function (obj, key) {
    var keys = Object.keys(obj),
        i = keys.indexOf(key);
    return i !== -1 && keys[i + 1] && obj[keys[i + 1]];
};
exports.objectLast = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return key;
};
exports.objectSize = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

exports.array_count_values = function (arr) {
    var counts = {};
    var key = "";
    for (var i = 0; i < arr.length; i++) {
        key = arr[i];
        counts[key] = (counts[key]) ? counts[key] + 1 : 1;

    }
    return counts;
};


exports.splitUKPostcodeFormat = function (mypostcode) {

    var postcode = mypostcode.trim();
    postcode = postcode.replace(/ /g, "");
    var test = postcode;
    if (test.substr(-3) == " ") {
        postcode = postcode;
    } else {
        test = utility.stringrpl(-3, " ", test);
        postcode = test;
    }
    return postcode;
};
exports.stringrpl = function (x, r, str) {
    var out = "";
    var temp = str.substr(x);
    out = utility.substr_replace(str, r, x);
    out += temp;
    return out;
};

exports.substr_replace = function (str, replace, start, length) {
    if (start < 0) {
        start = start + str.length;
    }
    length = length !== undefined ? length : str.length;
    if (length < 0) {
        length = length + str.length - start;
    }

    return [
        str.slice(0, start),
        replace.substr(0, length),
        replace.slice(length),
        str.slice(start + length)
    ].join('');
};



exports.getMessages = function (msg, fix) {
    var data = '';
    if (!utility.checkEmpty(messages.vals[msg])) {
        data = messages.vals[msg];
        if (data instanceof Function) {
            return data(fix);
        }
    }
    return data;
};

exports.getDistanceFromLatLon = function (lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

exports.telFormat = function (num) {
    num = " " + num + " ";
    num = num.replace(/\s/g, '');
    num = parseInt(num);
    return num;
}

exports.strFormat = function (str) {
    str = "" + str + "";
    return str;
};

exports.trimMobile = function (num) {
    if (!utility.checkEmpty(num)) {
        num = " " + num + " ";
        num = utility.checkInt(num);
        num = "" + num + "";
        num = num.replace(/\s/g, '');
        num = num.replace("/[^0-9]/", "");
        num = "" + num + "";
        num = num.trim();
        num = num.substr(-10);
    }
    return num;
};

exports.prettyMobile = function (num) {
    if (!utility.checkEmpty(num)) {
        num = utility.trimMobile(num);
        num = '0' + '' + num;
    }
    return num;
}

exports.getRand = function () {
    return _.random(1000, 9999);
}
exports.getPrettyTime = function (time) {
    time = utility.carbon.format(time, 'YYYY-MM-DD HH:mm:ss');
    return time;
};
exports.ucwords = function (str) {
    return (str + '')
        .replace(/^(.)|\s+(.)/g, function ($1) {
            return $1.toUpperCase()
        })
};
exports.clearPostcodeString = function (string) {
    var str = '';
    if (!utility.checkEmpty(string)) {
        string = string + '';
        string = string.trim();
        string = string.replace(/ /g, '-');
        string = string.replace(/[^A-Za-z0-9\-]/g, '');
        string = string.replace(/-+/g, '');
        string = string.toUpperCase();
        string = string.trim();
        str = string;
    }
    return str;
};
exports.getCountryCode = function (req) {
    var storedetails = req.locals.storedetails;
    var code = "44";
    if (storedetails.store_Country == 'United Kingdom') {
        code = "44";
    } else if (storedetails.store_Country == 'India') {
        code = "91";
    } else if (storedetails.store_Country == 'Pakistan') {
        code = "92";
    } else if (storedetails.store_Country == 'Germany') {
        code = "49";
    }
    return code;
}
exports.getUrl = function () {
    //var q = urlmod.parse(adr, true);
    var url = req.locals.appUrl;
    //console.log(url);
    url = url.replace(/https:\/\//g, '');
    url = url.replace(/http:\/\//g, '');
    url = url.replace(/www./g, '');
    url = "www." + url;
    return url;
};
exports.getWebUrl = function () {
    //var q = urlmod.parse(adr, true);
    var url = req.locals.appUrl;
    //console.log(url);
    url = url.replace(/https:\/\//g, '');
    url = url.replace(/http:\/\//g, '');
    url = url.replace(/www./g, '');
    //url="https://"+url;
    url = "http://localhost:3000";
    return url;
};
exports.cacheCdn = function () {
    var path = "https://cdn.dineorder.com";
    //$path = "https://res.cloudinary.com/redoq/raw/upload";
    return path;
};
exports.get_cache_data_path = function () {
    var store_Cache_Data_Url = "https://cdn.dineorder.com";
    return store_Cache_Data_Url;
};
exports.imageCdn = function () {
    return "https://cdn.dineorder.com";
};
exports.getCurrencyCode = function () {
    return "£";
}
exports.validateServerIp = function (ssip) {
    var servers = ['mysql_dine_server_india', 'mysql_dine_server_pakistan', 'mysql_dine_server_uk', 'mysql_dine_server_uk_justeat1', 'mysql_dine_server_uk_justeat2', 'mysql_dine_server_uk_justeat3', 'mysql_dine_server_uk_4', 'mysql_dine_server_uk_justeat4', 'mysql_dine_server_uk_justeat5', 'mysql_dine_server_uk_justeat6'];
    if (!_.contains(servers, ssip)) {
        ssip = utility.getStoreServerIp();
    }
    return ssip;
};
exports.getStoreServerIp = function () {
    // to do
    return 'mysql_dine_server_uk';
};


exports.getStoretimesList = async () => "getStoretimesList";
exports.getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
}
exports.translateDataToTree = async (data) => {
    let parents = data.filter(value => value.common_privilege_Parent_Id == 'undefined' || value.common_privilege_Parent_Id == null || value.common_privilege_Parent_Id == 0)
    let childrens = data.filter(value => value.common_privilege_Parent_Id !== 'undefined' && value.common_privilege_Parent_Id != null && value.common_privilege_Parent_Id != 0)

    let translator = (parents, childrens) => {
        parents.forEach((parent) => {
            childrens.forEach((current, index) => {
                if (current.common_privilege_Parent_Id === parent.common_privilege_Id) {
                    let temp = JSON.parse(JSON.stringify(childrens))
                    temp.splice(index, 1)
                    translator([current], temp)
                    typeof parent.childrens !== 'undefined' ? parent.childrens.push(current) : parent.childrens = [current]
                }
            }
            )
        }
        )
    }

    //Call transformation method
    translator(parents, childrens)

    //Return the final result
    return parents
};
exports.arr_diff = (a1, a2) => {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
};
exports.put_space_after_three_char = a => `${a.slice(0, 3)} ${a.slice(a.length - 3)}`;
exports.cleanNumbers = (string) => {
    var string = string.replace(" ", "-");
    string = string.replace(/[^0-9]/g, "");
    return string;
}
exports.ValidateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
exports.capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
exports.convert_positive = (a) => {
    if (a < 0) {
        a = a * -1;
    }
    return a;
}

exports.storePreorderTime = (req, _date) => {
    var time_interval = 0;
    var now = req.locals.now;
    now = now.slice(0, 10);
    if (!utility.checkEmpty(_date)) {
        let day = _date.split('||');
        if (!utility.checkEmpty(day) && !utility.checkEmpty(day[0] && !utility.checkEmpty(day[1]))) {
            let time = day[0].split(':');
            time = parseFloat(time[0] * 60) + parseFloat(time[1]);
            let time2 = day[1].split(':');
            time2 = parseFloat(time2[0] * 60) + parseFloat(time2[1]);
            time_interval = time2 - time;
        }

    }
    return time_interval;
}






exports.storePreorderTimeStatus = (_date) => {
    return !this.checkEmpty(_date) ? 'Yes' : 'No';


}
exports.storePreorderStartTime = (_date) => {
    if (!utility.checkEmpty(_date)) {
        var day = _date.split('||');
        var time = day[0];
        return time;
    }
    return _date;

};
exports.storePreorderCloseTime = (_date) => {
    if (!utility.checkEmpty(_date)) {
        var day = _date.split('||');
        var time = day[day.length - 1]
        return time;
    }
    return _date;

};
exports.storePreorderFormat = (req, data) => {

    var {
        store_preorder_Monday,
        store_preorder_Tuesday,
        store_preorder_Wednesday,
        store_preorder_Thursday,
        store_preorder_Friday,
        store_preorder_Saturday,
        store_preorder_Sunday
    } = data;
    data.store_preorder_Monday_Status = this.storePreorderTimeStatus(store_preorder_Monday);
    data.store_preorder_Time_interval_Monday = this.storePreorderTime(req, store_preorder_Monday);
    data.store_preorder_Open_time_Monday = this.storePreorderStartTime(store_preorder_Monday);
    data.store_preorder_Close_time_Monday = this.storePreorderCloseTime(store_preorder_Monday);

    data.store_preorder_Tuesday_Status = this.storePreorderTimeStatus(store_preorder_Tuesday);
    data.store_preorder_Time_interval_Tuesday = this.storePreorderTime(req, store_preorder_Tuesday);
    data.store_preorder_Open_time_Tuesday = this.storePreorderStartTime(store_preorder_Tuesday);
    data.store_preorder_Close_time_Tuesday = this.storePreorderCloseTime(store_preorder_Tuesday);

    data.store_preorder_Wednesday_Status = this.storePreorderTimeStatus(store_preorder_Wednesday);
    data.store_preorder_Time_interval_Wednesday = this.storePreorderTime(req, store_preorder_Wednesday);
    data.store_preorder_Open_time_Wednesday = this.storePreorderStartTime(store_preorder_Wednesday);
    data.store_preorder_Close_time_Wednesday = this.storePreorderCloseTime(store_preorder_Wednesday);

    data.store_preorder_Thursday_Status = this.storePreorderTimeStatus(store_preorder_Thursday);
    data.store_preorder_Time_interval_Thursday = this.storePreorderTime(req, store_preorder_Thursday);
    data.store_preorder_Open_time_Thursday = this.storePreorderStartTime(store_preorder_Thursday);
    data.store_preorder_Close_time_Thursday = this.storePreorderCloseTime(store_preorder_Thursday);

    data.store_preorder_Friday_Status = this.storePreorderTimeStatus(store_preorder_Friday);
    data.store_preorder_Time_interval_Friday = this.storePreorderTime(req, store_preorder_Friday);
    data.store_preorder_Open_time_Friday = this.storePreorderStartTime(store_preorder_Friday);
    data.store_preorder_Close_time_Friday = this.storePreorderCloseTime(store_preorder_Friday);

    data.store_preorder_Saturday_Status = this.storePreorderTimeStatus(store_preorder_Saturday);
    data.store_preorder_Time_interval_Saturday = this.storePreorderTime(req, store_preorder_Saturday);
    data.store_preorder_Open_time_Saturday = this.storePreorderStartTime(store_preorder_Saturday);
    data.store_preorder_Close_time_Saturday = this.storePreorderCloseTime(store_preorder_Saturday);

    data.store_preorder_Sunday_Status = this.storePreorderTimeStatus(store_preorder_Sunday);
    data.store_preorder_Time_interval_Sunday = this.storePreorderTime(req, store_preorder_Sunday);
    data.store_preorder_Open_time_Sunday = this.storePreorderStartTime(store_preorder_Sunday);
    data.store_preorder_Close_time_Sunday = this.storePreorderCloseTime(store_preorder_Sunday);
    return data;

};
exports.createSlug = async (string) => {
    //console.log('chekkkkkkkk',string);
    string = this.cleanString(string);
    string = string.toLowerCase();
    return string;
};

exports.getTimeZone = () => {

    var storedetails_TimeZone = "Europe/London";
    /*
        if (Session::has('store_Timezone'))
        {
            $storedetails_TimeZone = Session::get('store_Timezone');
        }
        else
        {
            $storedetails = getAllStoreDetailsUrl();
            Session::put('store_Timezone', $storedetails[0]->store_Timezone);
            $storedetails_TimeZone = $storedetails[0]->store_Timezone;
            Session::put('storedetails', $storedetails);
        }
    */
    return storedetails_TimeZone;

    // return Config::get('app.timezone');
};
exports.splitUKPostcodeFormat = function (mypostcode) {

    var postcode = mypostcode.trim();
    postcode = postcode.replace(/ /g, "");
    var test = postcode;
    if (test.substr(-3) == " ") {
        postcode = postcode;
    }
    else {
        test = utility.stringrpl(-3, " ", test);
        postcode = test;
    }
    return postcode;
};
exports.stringrpl = function (x, r, str) {
    var out = "";
    var temp = str.substr(x);
    out = utility.substr_replace(str, r, x);
    out += temp;
    return out;
};

exports.substr_replace = function (str, replace, start, length) {
    if (start < 0) {
        start = start + str.length;
    }
    length = length !== undefined ? length : str.length;
    if (length < 0) {
        length = length + str.length - start;
    }

    return [
        str.slice(0, start),
        replace.substr(0, length),
        replace.slice(length),
        str.slice(start + length)
    ].join('');
};

exports.deg2rad = deg => (deg * Math.PI) / 180.0;
exports.rad2deg = rad => rad * 180 / Math.PI;
exports.getLocationDist = async (address, store_Postcode) => {
    var locationresult = await this.calculateGoogleLocation(store_Postcode, address);
    return locationresult;
}
exports.calculateGoogleLocation = async (store_Postcode, pos_basket_Customer_Billing_Postcode) => {
    var pos_basket_Delivery_Distance = await this.getGoogleDistancePostcode(store_Postcode, pos_basket_Customer_Billing_Postcode);
    var distanceData = await utility.getUKAddressPostcode(pos_basket_Customer_Billing_Postcode);
    var locationresult = {
        'postcode': '',
        'street': '',
        'city': '',
        'latitude': '',
        'longitude': '',
        'distanceInMetre': ''
    };
    if (!utility.checkEmpty(distanceData)) {
        if (!utility.checkEmpty(distanceData['pos_basket_Customer_Billing_Latitude'])) {
            locationresult['latitude'] = distanceData['pos_basket_Customer_Billing_Latitude'];
        }
        if (!utility.checkEmpty(distanceData['pos_basket_Customer_Billing_Longitude'])) {
            locationresult['longitude'] = distanceData['pos_basket_Customer_Billing_Longitude'];
        }
        if (!utility.checkEmpty(distanceData['street'])) {
            locationresult['street'] = distanceData['street'];
        }
        if (!utility.checkEmpty(distanceData['cityName'])) {
            locationresult['city'] = distanceData['cityName'];
        }
        locationresult['distanceInMetre'] = pos_basket_Delivery_Distance;
        locationresult['postcode'] = utility.splitUKPostcodeFormat(pos_basket_Customer_Billing_Postcode);
    }
    return locationresult;
}
exports.getGoogleDistancePostcode = async function (origin, destination) {
    var storedetails = req.locals.storedetails;
    if (storedetails.store_Country == 'India') {
        origin = utility.cleanString(origin);
        destination = utility.cleanString(destination);
    } else {
        origin = utility.splitUKPostcodeFormat(origin);
        destination = utility.splitUKPostcodeFormat(destination);
    }

    var distance = await methods.get_gapi_distance(origin, destination);
    if (!utility.checkEmpty(distance) && distance != '0.00') {
        return distance;
    }
    var apikey = constants.vals.google_api_distance;
    var url_distance = "https://maps.googleapis.com/maps/api/distancematrix/json?&key=" + apikey + "&";
    url_distance = url_distance + 'origins=' + encodeURIComponent(origin) + '&destinations=' + encodeURIComponent(destination);
    var resp_json_distance = await utility.curl_gapi_file_get_contents(url_distance);
    var resp_distance = "";
    distance = 0;
    if (!utility.checkEmpty(resp_json_distance)) {
        resp_distance = JSON.parse(resp_json_distance);

        if (resp_distance['status'] == 'OK') {
            //utility.issetNested(resp_distance, 'rows', '0', 'elements','0','distance','value');
            if (utility.issetNested(resp_distance, 'rows', '0', 'elements', '0', 'distance', 'value')) {
                distance = resp_distance['rows'][0]['elements'][0]['distance']['value'];

            }
        }

    }
    methods.insert_gapi_distance(origin, destination, distance);
    distance = parseFloat(distance);
    return distance;

};
exports.curl_gapi_file_get_contents = async (url) => new Promise(
    (resolve, reject) => {
        request({
            url: url,
            method: 'get',

        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            resolve(body);
        });
    });


exports.formatNumber = (num) => {
    return this.number_format(Math.round((num), 2), 2, '.', '');
}
exports.formatTotal = function (num) {
    return utility.number_format(Math.round(num * 100) / 100, 2, '.', '');
};
exports.number_format = (number, decimals, dec_point, thousands_sep) => {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
exports.NHis = mydate => {
    var days = {
        'Monday': '1',
        'Tuesday': '2',
        'Wednesday': '3',
        'Thursday': '4',
        'Friday': '5',
        'Saturday': '6',
        'Sunday': '7'
    }
    var weekNumber = days[moment(mydate).format('dddd')];
    var hours = moment(mydate).format("HH");
    var minutes = moment(mydate).format("mm");
    var seconds = moment(mydate).format("ss");
    return weekNumber + hours + minutes + seconds;

};
exports.getPrettyDueTime = (minutes) => {
    var val = 0;
    if (minutes == 0) {
        val = minutes;
    } else if (minutes <= 60) {
        val = minutes + " Minutes";
    } else if (minutes <= 1440) {
        val = Math.floor(minutes / 60) + " Hour";
    } else if (minutes <= 10080) {
        val = Math.floor(minutes / 1440) + " Day";
    } else if (minutes <= 43800) {
        val = Math.floor(minutes / 10080) + " Week";
    } else if (minutes <= 525600) {
        val = Math.floor(minutes / 43800) + " Month";
    } else if (minutes > 525600) {
        val = Math.floor(minutes / 525600) + " Year";
    } else {
        val = minutes + " Minutes";
    }
    return val;
}
exports.notify_customer_tablebooking = (pos_tablebooking_Data, store_Id, store_Server_Ip, store_Sms_Provider, tableId, status, store_Name, store_Telephone) => {
    return true;
};

exports.checkCache = function (storedetails, type) {
    //return false;
    if (constants.vals.app_env == 'DEV') {
        return false;
    }
    var cache = true;
    if (!utility.checkEmpty(storedetails.store_Modules) && !utility.checkEmpty(storedetails.store_Modules['Cache ' + type]) && storedetails.store_Modules['Cache ' + type]) {
        cache = false;
    }
    return cache;
};



exports.check_file_exist = (req, path) => {
    return true;
    console.log(req.headers);
};
exports.array_values = item => {
    var val = [];
    for (var i in item) {
        val.push(item[i]);
    }
    return val;
};

exports.localCachePath = (req) => {
    var path = "/home/ubuntu/";
    if (constants.vals.app_env == 'PROD') {
        path = "/var/www/efs/";
    } else {
        path = "/home/ubuntu/";
    }


    return path;
};
exports.makeDirectoryIfnotexist = async (path) => {
    if (!fs.existsSync(path)) {
        await fs.mkdirSync(path, { recursive: true });
        try {
            await fs.chownSync(path, 33, 33);
        } catch (e) {

        }

    }
    return true;
};
exports.sleep = promisify(setTimeout);
exports.pretty_url = store_Name => {
    store_Name = store_Name.trim();
    store_Name = store_Name.toLowerCase();
    store_Name = store_Name.replace(/ ![^a-z0-9]+!i /g, '-');
    store_Name = store_Name.toLowerCase();
    return store_Name;


};
exports.array_count_values = (datas) => {
    var counts = {};
    for (var i in datas) {
        let data = datas[i];
        if (utility.checkEmpty(counts[data])) {
            counts[data] = 1
        } else {
            counts[data]++;
        }
    }
    return counts;

}
exports.array_keys = datas => {
    var a = [];
    for (var i in datas) {
        a.push(i);
    }
    return a;

}
exports.sendsmsApi = async (req, product_Id, smsTime, telephone, message, media_Id, orig) => {
    var now = req.locals.now;
    let store_Name = 'DineOrder';
    let url = this.getApiserviceData('url') + "/media/singlesms";
    // Nexmo, vodoo, textmarketer, textgoto
    var comlog_Product = {
        1: 'Nexmo',
        2: 'vodoo',
        3: 'textmarketer',
        4: 'textgoto',
    }
    let data = {
        "inputData": {
            "comlog_Product": "sms",
            "comlog_Medium": comlog_Product[media_Id],
            "num": telephone,
            "product_Id": product_Id,
            "message": message,
            "orig": orig,
            "media_Id": media_Id,
            "smstime": ''
        }
    }
    if (now != smsTime) {
        smsTime = new Date(smsTime).toUTCString();
        smsTime = smsTime.replace('GMT', 'UTC');
        data.inputData.smstime = smsTime
    }
    let header = {
        "authkey": utility.encryptlara("DineOrder" + ":::")
    }
    let method = "POST"
    var d = await utility.curl_api_content(url, method, header, JSON.stringify(data));
    return d;
}
exports.sendEmailApi = async (req, emailTime, emails, mesaage) => {
    let store_Name = 'DineOrder';
    let url = this.getApiserviceData('url') + "/media/mail";
    var now = req.locals.now;
    let data = {
        "inputData": {
            "comlog_Product": "mail",
            "comlog_Medium": "mailgun",
            "subject": "DineOrder - test MAIL",
            "to_mail": emails,
            "type": "text",
            "data": "Hello",
            "media_id": 1,
            "message": this.emailTemplate(mesaage),
            "deliverytime": "",
            "bodytype": "html",
        }
    };

    if (emailTime != now) {
        emailTime = new Date(emailTime).toUTCString();
        data.inputData.deliverytime = emailTime.replace('GMT', 'UTC');
    }
    let header = {
        "authkey": utility.encryptlara("DineOrder" + ":::")
    }
    let method = "POST"
    var d = await utility.curl_api_content(url, method, header, JSON.stringify(data));
};
exports.curl_api_content = async (url, method, headers, jsonData) => new Promise(
    (resolve, reject) => {
        request({
            url: url,
            method: method,
            headers: headers,
            json: JSON.parse(jsonData),
        }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            let x = {};
            x['resp'] = response;
            x['err'] = error;
            resolve(body);
        });
    });
exports.getApiserviceData = function (key) {
    var service_stg = {
        'url': constants.vals.apiurl.microservice + "/extapi",
        'authkey': utility.encryptlara("DineOrder" + ":::")
    };
    return service_stg[key];

    // var service_pm = {
    // 	'url': 'http://172.17.0.4:3000/extapi',
    // 	'authkey': utility.encryptlara("DineOrder"+":::")
    // };
    // var service_stg = {
    // 	'url': 'https://staging.microservice.dinetestapi.com/extapi',
    // 	'authkey': utility.encryptlara("DineOrder"+":::")
    // };
    // return service_pm[key];
}
exports.increase_brightness = function (hex, percent) {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return '#' +
        ((0 | (1 << 8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0 | (1 << 8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
};
exports.stripText = function (str, length) {
    var append = "...";
    var str = str.trim();
    if (str.length > length) {
        // $string = wordwrap($string, $length);
        var re = new RegExp("([\\w\\s]{" + (length - 2) + ",}?\\w)\\s?\\b", "g");
        str = str.replace(re, "$1\n");
        str = str.split("\n");
        str = str[0] + append;
    }
    return str;
};
exports.ltrim = function (data) {
    var result = data.replace(/^0+/, ''); //parseInt(data)
    return result;
};
exports.sendPusher = async (storedetails, events) => {
    if (storedetails.store_Web_Socket == 'Pusher' && !utility.checkEmpty(events)) {
        let url = utility.getApiserviceData('url') + "/media/pusher";
        let data = {
            "inputData": {
                "channel": "pusher-" + storedetails.product_Id,
                "product_Id": storedetails.product_Id,
                "store_Server_Ip": storedetails.store_Server_Ip,
                "comlog_Product": "pusher",
                "comlog_Medium": "pusher",
                "media_id": 1,
                "events": events
            }
        }
        let header = {
            "authkey": utility.getApiserviceData('authkey')
        }

        let method = "POST"
        await utility.curl_api_content(url, method, header, JSON.stringify(data));
    }
};
exports.coupon_random = function (length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.copyCacheFiles = async (req, type, storedetails) => {
    var root_cache_path = this.localCachePath(req);
    root_cache_path = root_cache_path + "datacache/";
    var website_url = storedetails.store_Website;
    if (utility.checkEmpty(storedetails)) {
        return 'Store not Found!';
    }
    if (!['mobile', 'website', 'system', 'dineorder'].includes(type)) {
        return "Invalid Cache";
    }
    // await zip(root_cache_path,this.localCachePath()+'datacache.zip');

};
exports.imageCdn = () => {
    var path = "https://cdn.dineorder.com";
    return path;
};
exports.replaceWithCdn = (link) => {
    var imageCdn = this.imageCdn();
    var cdnlink = link;
    return cdnlink;
    var cdns = [
        'http://www.cdn.dineorder.com',
        'https://www.cdn.dineorder.com',
        'http://cdn.dineorder.com',
        'https://cdn.dineorder.com'
    ]
    for (var i in cdns) {
        cdnlink = cdns[i].replace(cdnlink, cdnlink);

    }
};
exports.formatUrl = function (url) {
    //console.log(url,'lllll');
    //url = url.replace(/(?:https?:\/\/)?(?:www\.)?(.*)\/?$/i,'');
    url = url.replace('https://', '');
    url = url.replace('http://', '');
    url = url.replace('www.', '');
    //console.log(url,'uuu');
    //url = url.replace(/www./,'');
    //console.log(url,'www');
    url = "www." + url;
    return url;
};
exports.getOriginUrl = (req) => {
    var url = req.headers.origin;
    url = utility.formatUrl(url);
    return url;
}


exports.sendExtComApi = async function (req, apiObj) {
    let product_Id = 0;
    if (!utility.checkEmpty(req.locals.storedetails)) {
        product_Id = req.locals.storedetails.product_Id;
    }
    let orig = 'DineOrder';
    var dataObj = {};
    var dataApiObj = {};
    dataApiObj.inputData = {};
    if (utility.checkEmpty(apiObj.orig) && !utility.checkEmpty(req.locals.storedetails)) {
        orig = req.locals.storedetails.store_Sms_Sender_Id;
        if (utility.checkEmpty(orig)) {
            orig = req.locals.storedetails.store_Name.replace(" ", "").toUpperCase();
        }
        if (apiObj.media == 'voice') {
            orig = req.locals.storedetails.store_Name.replace(" ", "").toUpperCase();
        }
        orig = orig.substr(0, 11);
    }
    if (orig == 'DineOrder' && !utility.checkEmpty(apiObj.orig)) {
        orig = apiObj.orig.substr(0, 11);
    }

    if (apiObj.media == 'voice') {
        let data = {};
        data.medium = 'voice';
        data.provider = apiObj.provider;
        let events = [];
        let event = {};
        if (utility.checkEmpty(apiObj.type)) {
            apiObj.type = 'otp';
        }
        event.to = apiObj.to;
        event.text = apiObj.text;
        event.type = apiObj.type;
        event.orig = orig;
        events.push(event);
        data.events = events;
        dataObj = data;
    } else if (apiObj.media == 'sms') {
        let data = {};
        data.medium = 'sms';
        data.provider = apiObj.provider;
        let events = [];
        let event = {};
        event.to = apiObj.to;
        event.msg = apiObj.text;
        event.orig = orig;
        events.push(event);
        data.events = events;
        dataObj = data;
    } else if (apiObj.media == 'email') {
        let data = {};
        data.medium = 'email';
        data.provider = apiObj.provider;
        let events = [];
        let event = {};
        event.to = apiObj.to;
        event.subject = apiObj.subject;
        event.body = apiObj.body;
        event.type = apiObj.type;
        events.push(event);
        data.events = events;
        dataObj = data;
    } else if (apiObj.media == 'socket') {
        let data = {};
        data.medium = 'socket';
        data.provider = apiObj.provider;
        data.channel = apiObj.channel;
        data.events = apiObj.events;
        dataApiObj.inputData.channel = apiObj.channel;
        dataObj = data;
        dataObj = await utility.nestedObjToStr(req, dataObj);
    }
    else if (apiObj.media == 'push_notification') {
        let data = {};
        data.medium = 'push_notification';
        data.provider = apiObj.provider;
        data.channel = apiObj.channel;
        data.events = apiObj.events;
        dataApiObj.inputData.appname = apiObj.appname;
        dataApiObj.inputData.channel = apiObj.channel;
        dataObj = data;
    }
    if (!utility.checkEmpty(dataObj)) {
        dataApiObj.inputData.product_Id = product_Id;
        dataApiObj.inputData.com_Product = req.locals.appService;
        dataApiObj.inputData.com_Medium = dataObj.medium;
        dataApiObj.inputData.com_Provider = apiObj.provider;
        dataApiObj.inputData.events = dataObj.events;
        let header = {
            "authkey": constants.vals.auth_key
        };
        let method = "POST"
        let url = constants.vals.apiurl.microservice + "/extapi/media/" + apiObj.media;


        let apiobjto = "";
        if (!utility.checkEmpty(apiObj.to)) {
            apiobjto = apiObj.to;
        }
        let apiObjtype = "";
        if (!utility.checkEmpty(apiObj.type)) {
            apiObjtype = apiObj.type;
        }


        let comlogObj = {};
        comlogObj['comslog_Product'] = req.locals.appService; // webservice/dineservice/jumpservice 
        comlogObj['product_Id'] = product_Id; // store product Id
        comlogObj['comslog_Medium'] = dataObj.medium; // sms/email/pusher
        comlogObj['comslog_Provider'] = apiObj.provider; // medium_Name
        comlogObj['comslog_Request_Body'] = dataApiObj;
        comlogObj['comslog_Request_Type'] = apiObjtype;
        comlogObj['comslog_To'] = apiobjto;
        comlogObj['comslog_Ip'] = req.locals.clientIp;
        comlogObj['comslog_Status'] = 'Queue';
        comlogObj['created_at'] = req.locals.now;
        try {
            constants.vals.mongodbconn[constants.vals.commonDB].model("comslog")(comlogObj).save();
        } catch (e) {
            console.log('MDB ERR', e);
        }





        utility.curl_api_content(url, method, header, JSON.stringify(dataApiObj));




        if (apiObj.media == 'sms' && !utility.checkEmpty(req.locals.storedetails)) {
            let params = {}
            params.store_Id = req.locals.storedetails.store_Id;
            params.pos_sms_single_history_Text = apiObj.text;
            params.pos_sms_single_history_Date = req.locals.now;
            params.pos_sms_single_history_Number = apiObj.to;
            params.created_at = req.locals.now;
            dbquery.insertSingle(req, req.locals.ssip, 'pos_sms_single_history', params);
        }
    }
};

exports.sendPageRefreshPusher = (req) => {

    if (req.locals.storedetails.store_Web_Socket == 'Pusher') {
        let events = [];
        events['notify-page-refresh'] = {
            'store_Id': req.locals.storedetails.store_Id,
            'pos_lookup_Type': 'Page Refresh',
            'pos_lookup_Date': req.locals.now,
        };

        let apiObj = {};
        apiObj.channel = "pusher-" + req.locals.storedetails.product_Id;
        apiObj.media = 'socket';
        apiObj.provider = "Pusher";
        apiObj.events = events;
        utility.sendExtComApi(req, apiObj);
    }

};


exports.formatBasketCharges = function (req, storedetails, basketdata) {
    var pos_basket_Charges = [];
    var dataType = {};

    if (utility.checkFloat(basketdata.pos_basket_Sub_Total) > 0) {
        dataType = {};
        dataType.label = "Sub Total";
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Sub_Total));
        pos_basket_Charges.push(dataType);
    }
    // if (basketdata.restriction.status) {
    //     basketdata.pos_basket_Charges = pos_basket_Charges;
    //     return pos_basket_Charges;
    // }
    let basketCoupon = utility.checkFloat(basketdata.pos_basket_Default_Discount) + utility.checkFloat(basketdata.pos_basket_Manual_Discount);
    if (utility.checkFloat(basketCoupon) > 0) {
        dataType = {};
        dataType.label = "Coupon";
        if (!utility.checkEmpty(basketdata.store_coupon_Code)) {
            dataType.label += " (" + basketdata.store_coupon_Code + ")";
        }
        dataType.value = "-" + storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketCoupon));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Packaging_Amount) > 0) {
        dataType = {};
        dataType.label = "Packaging Amount";
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Packaging_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Minimum_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Minimum_Label;
        if (utility.checkEmpty(dataType.label)) {
            dataType.label = "Minimum" + basketdata.pos_basket_Delivery_Type;
        }
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Minimum_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Default_Price_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Default_Price_Label;
        if (utility.checkEmpty(dataType.label)) {
            dataType.label = basketdata.pos_basket_Delivery_Type + "Charge";
        }
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Default_Price_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Delivery_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Delivery_Label;
        if (utility.checkEmpty(dataType.label)) {
            dataType.label = basketdata.pos_basket_Delivery_Type + "Charge";
        }
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Delivery_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (basketdata.pos_basket_Delivery_Type == 'Delivery') {
        dataType = {};
        dataType.label = "Delivery Distance";
        dataType.value = utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Delivery_Amount)) + " " + storedetails.store_Distance_Unit;
        pos_basket_Charges.push(dataType);
    }

    if (!utility.checkEmpty(basketdata.pos_basket_Tax_Data)) {
        for (let t in basketdata.pos_basket_Tax_Data) {
            let finalTaxData = basketdata.pos_basket_Tax_Data[t];
            dataType = {};
            dataType.label = finalTaxData.name;
            dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(finalTaxData.value));
            pos_basket_Charges.push(dataType);
        }
    }

    if (utility.checkFloat(basketdata.pos_basket_Payment_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Payment_Label;
        if (utility.checkEmpty(dataType.label)) {
            dataType.label = "Service Charge";
        }
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Payment_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Dineorder_Service_Charge_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Dineorder_Service_Charge_Label;
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Dineorder_Service_Charge_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Weather_Surcharge_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Weather_Surcharge_Label;
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Weather_Surcharge_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Tip_Amount) > 0) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Tip_Label;
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Tip_Amount));
        pos_basket_Charges.push(dataType);
    }

    if (utility.checkFloat(basketdata.pos_basket_Point_Amount) > 0 && !utility.checkEmpty(basketdata.pos_basket_Point_Applied)) {
        dataType = {};
        dataType.label = basketdata.pos_basket_Point_Label;
        if (utility.checkEmpty(dataType.label)) {
            dataType.label = "Loyalty Points";
        }
        dataType.value = storedetails.store_Currency + "" + utility.formatTotal(utility.checkFloat(basketdata.pos_basket_Point_Amount));
        pos_basket_Charges.push(dataType);
    }

    basketdata.pos_basket_Charges = pos_basket_Charges;
    return pos_basket_Charges;


}

// CCAPP Start


exports.productAligner = function (quantity, name, price, appDeviceType, max_characters) {
    quantity = quantity.trim();
    name = name.trim();
    price = price.trim();

    var paperSize = max_characters.paper_linesize;
    var quantitySize = max_characters.product_qty;
    var nameSize = max_characters.product_name;
    var priceSize = max_characters.product_price;

    var quantityGap = "";
    var nameGap = "";
    var priceGap = "";
    var finalData = "";

    var finalQuantity = [];
    var finalName = [];
    var finalPrice = [];
    var finalString = [];

    //qty start
    var lopperForQuantity = quantitySize - quantity.length;
    for (let x = 0; x < lopperForQuantity; x++) {
        quantityGap = quantityGap + " ";
    }
    finalQuantity.push(quantity + quantityGap);
    //qty end

    //name start
    if (name.length <= nameSize) {
        var lopperForName = nameSize - name.length;
        if (lopperForName > 0) {
            for (let x = 0; x < lopperForName; x++) {

                nameGap = nameGap + " ";
            }
        }
        finalData += name + nameGap;
        finalName.push(finalData);
    }
    else {
        var tempNameArray = name.split(" ");
        var eachNameLine = "";
        for (let a = 0; a < tempNameArray.length; a++) {
            if (!utility.checkEmpty(tempNameArray[a])) {
                var aditionFutureCount = 0;
                if (utility.checkEmpty(eachNameLine)) {
                    aditionFutureCount = eachNameLine.length + tempNameArray[a].length;
                } else {
                    aditionFutureCount = eachNameLine.length + 1 + tempNameArray[a].length;
                }

                if (aditionFutureCount <= (nameSize - 1)) // this loop word can be added
                {
                    if (!utility.checkEmpty(eachNameLine)) { eachNameLine += " "; }
                    eachNameLine += tempNameArray[a];
                } else // this loop word can not be added so push to finalName
                {
                    eachNameLine = utility.addSpaceIntoString(eachNameLine, (nameSize - eachNameLine.length), "end");
                    finalName.push(eachNameLine);
                    eachNameLine = "";
                    eachNameLine += tempNameArray[a];
                }

                if (a == tempNameArray.length - 1 && !utility.checkEmpty(eachNameLine)) {
                    eachNameLine = utility.addSpaceIntoString(eachNameLine, (nameSize - eachNameLine.length), "end");
                    finalName.push(eachNameLine);
                }

            }
        }
    }
    //name end

    //price start
    var lopperForPrice = priceSize - price.length;
    for (let x = 0; x < lopperForPrice; x++) {

        priceGap = priceGap + " ";
    }
    finalPrice.push(priceGap + price);
    //price end

    var makeData = "";
    for (let x = 0; x < finalName.length; x++) {
        makeData = "";
        if (x == 0) {
            makeData = finalQuantity[x] + "" + finalName[x] + "" + finalPrice[x];
        }
        else {
            for (let y = 1; y <= quantitySize; y++) {
                makeData += " ";
            }

            makeData += finalName[x];
            var nameSpaceCount = nameSize - finalName[x].length;
            for (let z = 1; z <= nameSpaceCount; z++) {
                makeData += " ";
            }

            for (let z1 = 1; z1 <= priceSize; z1++) {
                makeData += " ";
            }
        }
        finalString.push(makeData);

    }
    return finalString;
}
exports.leftRightAligner = function (quantity, name, appDeviceType, max_characters) {
    quantity = quantity.trim();
    name = name.trim();

    var paperSize = max_characters.paper_linesize;
    var quantitySize = max_characters.product_qty;
    var nameSize = max_characters.product_name;

    var quantityGap = "";
    var nameGap = "";
    var finalData = "";

    var finalQuantity = [];
    var finalName = [];
    var finalString = [];

    //qty start
    var lopperForQuantity = quantitySize - quantity.length;
    for (let x = 0; x < lopperForQuantity; x++) {
        quantityGap = quantityGap + " ";
    }
    finalQuantity.push(quantity + quantityGap);
    //qty end

    //name start
    if (name.length <= nameSize) {
        var lopperForName = nameSize - name.length;
        if (lopperForName > 0) {
            for (let x = 0; x < lopperForName; x++) {

                nameGap = nameGap + " ";
            }
        }
        finalData += nameGap + name;
        finalName.push(finalData);
    }
    else {
        var tempNameArray = name.split(" ");
        var eachNameLine = "";
        for (let a = 0; a < tempNameArray.length; a++) {
            if (!utility.checkEmpty(tempNameArray[a])) {
                var aditionFutureCount = 0;
                if (utility.checkEmpty(eachNameLine)) {
                    aditionFutureCount = eachNameLine.length + tempNameArray[a].length;
                } else {
                    aditionFutureCount = eachNameLine.length + 1 + tempNameArray[a].length;
                }

                if (aditionFutureCount <= (nameSize - 1)) // this loop word can be added
                {
                    if (!utility.checkEmpty(eachNameLine)) { eachNameLine += " "; }
                    eachNameLine += tempNameArray[a];
                } else // this loop word can not be added so push to finalName
                {
                    eachNameLine = utility.addSpaceIntoString(eachNameLine, (nameSize - eachNameLine.length), "start");
                    finalName.push(eachNameLine);
                    eachNameLine = "";
                    eachNameLine += tempNameArray[a];
                }

                if (a == tempNameArray.length - 1 && !utility.checkEmpty(eachNameLine)) {
                    eachNameLine = utility.addSpaceIntoString(eachNameLine, (nameSize - eachNameLine.length), "start");
                    finalName.push(eachNameLine);
                }

            }
        }
    }
    //name end



    var makeData = "";
    for (let x = 0; x < finalName.length; x++) {
        makeData = "";
        if (x == 0) {
            makeData = finalQuantity[x] + " " + finalName[x];
        }
        else {
            for (let y = 1; y <= quantitySize; y++) {
                makeData += " ";
            }

            makeData += finalName[x];
            var nameSpaceCount = nameSize - finalName[x].length;
            for (let z = 1; z <= nameSpaceCount; z++) {
                makeData += " ";
            }
        }
        finalString.push(makeData);

    }
    return finalString;
}
exports.addSpaceIntoString = function (thestring, numSpace, position) {
    var returnString = "";
    var spaceGap = "";
    if (!utility.checkEmpty(thestring)) {
        for (let x = 1; x <= numSpace; x++) {
            spaceGap += " ";
        }
    }
    if (position == "start") {
        returnString = spaceGap + thestring;
    } else if (position == "end") {
        returnString = thestring + spaceGap;
    }
    return returnString;
}
exports.createUnderlineString = function (print_paper_width) {
    var underlineString = '';
    if (print_paper_width == 58) {
        underlineString = "________________________________";
    } else {
        underlineString = "________________________________________________";
    }
    return underlineString;

}

exports.wordwrapper = function (words, maxlength) {
    var toReturn = "";
    var remaining = "";
    var index = 0;
    for (let x = 0; x < words.length; x++) {
        if (toReturn.length < maxlength) {
            if (toReturn == "") {
                toReturn = words[x].toString();
            }
            else {
                toReturn = toReturn + " " + words[x].toString();
            }
            index++;
        }
        else {
            if (remaining == "") {
                remaining = words[x].toString();
            }
            else {
                remaining = remaining + " " + words[x].toString();
            }
        }
    }
    var returnValue = [];
    returnValue.push(toReturn);
    returnValue.push(remaining);
    return returnValue;
}
exports.get_month_short_code = function (monthnumber) {
    var monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthArray[monthnumber];
}
exports.get_formatted_datetime = function (req, dateString) {
    var tempDateString = "";
    var tempDate = utility.carbon.format(dateString, "DD");
    var tempMonth = utility.carbon.format(dateString, "M");
    tempMonth = utility.get_month_short_code(tempMonth - 1);
    var tempYear = utility.carbon.format(dateString, "Y");
    var tempTime = utility.carbon.format(dateString, "hh:mm A");
    tempDateString += tempDate + " " + tempMonth;
    var tempCurrentYear = utility.carbon.format(utility.carbon.now(req), "Y");
    if (tempCurrentYear != tempYear) { tempDateString += " " + tempYear; }
    tempDateString += " " + tempTime;
    return tempDateString;
}
exports.get_formatted_duetime = function (req, dateString) {
    var tempDateString = "";
    var tempDateString = utility.carbon.format(dateString, "hh:mm A");
    return tempDateString;
}

// CCAPP END

exports.emailTemplate = (mesaage) => {
    var a = `<!DOCTYPE html>
    <html>
       <head>
          <title>Email Template</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          
          <style>
          </style>
       </head>
       <body style="margin: 0">
          <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
          <!-- START HEADER/BANNER -->
          <tbody>
             <tr>
                <td align="center">
                 <a href="https://dineorder.com/">
                   <table class="col-600" width="600" border="0" align="center" cellpadding="0" 
                      cellspacing="0">
                      <tbody>
                       
                         <tr>
                          
                            <td align="center" valign="top" background="https://cdn.dineorder.com/uploads/FILE-20201214-0954TE8BD7XDU6BL.jpeg" bgcolor="#66809b" style="background-size:cover; background-position:top;">
                               <table class="col-600" width="600" height="300" border="0" align="center" cellpadding="0" cellspacing="0">
                                  <tbody>
                                     <tr>
                                        <td height="40"></td>
                                     </tr>
                                     <!-- <tr>
                                        <td align="center" style="line-height: 0px;">
                                            <img style="display:block; line-height:0px; font-size:0px; border:0px;" src="https://dineorderpos.com/public/assets/img/logo.png" width="109" height="33" alt="logo">
                                        </td>
                                        </tr> -->
                                     <tr>
                                        <td height="50"></td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
    
                         </tr>
    
                         
                      </tbody>
                   </table>
                   </a>
                   <table>
                      <tbody>
                         <tr>
                            <td align="center">
                               <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
                                  <tbody>
                                     <tr>
                                        <td align="center">
                                           <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" border-left: 1px solid #fff; border-right: 1px solid #fff;">
                                              <tbody>
                                                 <tr>
                                                    <td height="50"></td>
                                                 </tr>
                                                 <tr>
                                                    <td align="right">
                                                       <table class="col2" width="250" border="0" align="left" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                             <tr>
                                                                <td align="center" style="line-height:0px;">
                                                                   <img style="display:block; line-height:0px; font-size:0px; border:0px;" class="images_style" src="https://cdn.dineorder.com/uploads/FILE-20201214-0734YSC1NVYXPXYD.png" width="150" height="188">
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                       <table width="347" border="0" align="right" cellpadding="0" cellspacing="0" class="col2" style=" border-left:3px solid #ff5800">
                                                          <tbody>
                                                             <tr>
                                                                <td align="center">
                                                                   <table class="insider" width="80%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                                      <tbody>
                                                                         <!-- <tr align="left">
                                                                            <td style="font-family: 'Raleway', sans-serif; font-size:23px; color:#2a3b4c; line-height:30px; font-weight: 400;">Simple <span style="color:#ff5800">Pricing?</span></td>
                                                                         </tr>
                                                                         <tr>
                                                                            <td height="5"></td>
                                                                         </tr> -->
                                                                         <tr>
                                                                            <td style="font-family: 'Lato', sans-serif; font-size:13px; color:#7f8c8d; line-height:20px; font-weight: 300;">
                                                                            <p style="margin-top: 14px">
                                                                               A <span style="color:#ff5800">
                                                                         Food Portal</span> where you can place order and share your views about a takeaway or restaurant.
                                                                            </p>
                                                                            <p style="margin-top: 16px">
                                                                            Its <span style="color:#ff5800">very simple to use</span>, register and look for your takeaway or restaurant and place order.
                                                                         </p>
                                                                            </td>
                                                                         </tr>
                                                                      </tbody>
                                                                   </table>
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                     <!-- pricing -->
                                     <!-- START FOOTER -->
                                     
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                 
                </td>
             </tr>
    
             <!-- END HEADER/BANNER -->
             <!-- START 3 BOX SHOWCASE -->
             <!-- <tr>
                <td align="center">
                   <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px; border-left: 1px solid #fff; border-right: 1px solid #fff;">
                      <tbody>
                         <tr>
                            <td height="35"></td>
                         </tr>
                         <tr>
                            <td align="center" style="font-family: 'Raleway', sans-serif; font-size:24px; color:#000; line-height:22px; font-weight: 400; letter-spacing: 7px;">
                               WELCOME TO <span style="font-family: 'Raleway', sans-serif; font-size:22px; color:#ff5800; line-height:39px; font-weight: 300; letter-spacing: 7px;">DINEORDER</span>
                            </td>
                         </tr>
                         <tr>
                            <td align="center" style="font-family: 'Raleway', sans-serif;
                               font-size: 13px; color: #666;line-height: 20px; font-weight: 400;padding-top: 20px;">
                               Automate Your Takeaway With DineOrder<br/> Online Ordering System
                            </td>
                         </tr>
                         <tr>
                            <td height="10"></td>
                         </tr>
                      </tbody>
                   </table>
                </td>
             </tr> -->
             <tr>
                <td align="center">
                   <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="border-left: 1px solid #fff; border-right: 1px solid #fff; ">
                      <tbody>
                         <tr>
                            <td height="10"></td>
                         </tr>
                         <tr>
                            <td>
                               <table class="col3" width="100%" border="0" align="left" cellpadding="0" cellspacing="0">
                                  <tbody>
                                     <tr>
                                        <td height="30"></td>
                                     </tr>
                                     <tr>
                                        <td align="center">
                                           <table class="insider" width="70%" border="0" align="center" cellpadding="0" cellspacing="0">
                                              <tbody>
                                                 <tr align="center" style="line-height:0px;">
                                                    <td style="">
                                                       <img src="https://cdn.dineorder.com/uploads/FILE-20201214-0608QS4LZA187THT.png" alt="" style="width: 50px"/>
                                                    </td>
                                                 </tr>
                                                 <tr>
                                                    <td height="15"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Raleway', Arial, sans-serif; font-size:16px; color:#ff5800; line-height:24px; font-weight: 400;">Your Own Website</td>
                                                 </tr>
                                                 <tr>
                                                    <td height="10"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Lato', sans-serif; font-size:12px; color:#757575; line-height:18px; font-weight: 300;">Get your brand promoted along with your service. Why pay a third party when you can have your own online ordering website and never pay commission.</td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                               <table width="1" height="20" border="0" cellpadding="0" cellspacing="0" align="left">
                                  <tbody>
                                     <tr>
                                        <td height="20" style="font-size: 0;line-height: 0;border-collapse: collapse;">
                                           <p style="padding-left: 24px;">&nbsp;</p>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                               <table class="" width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="background: #f58a6812">
                                  <tbody>
                                     <tr>
                                        <td height="30"></td>
                                     </tr>
                                     <tr>
                                        <td align="center">
                                           <table class="insider" width="70%" border="0" align="center" cellpadding="0" cellspacing="0">
                                              <tbody>
                                                 <tr align="center" style="line-height:0px;">
                                                    <td style="">
                                                       <img src="https://cdn.dineorder.com/uploads/FILE-20201214-0726VPPR9D6BCJ5M.png" alt="app" style="width: 50px">
                                                    </td>
                                                 </tr>
                                                 <tr>
                                                    <td height="15"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Raleway', sans-serif; font-size:16px; color:#ff5800; line-height:24px; font-weight: 400;">Mobile Apps</td>
                                                 </tr>
                                                 <tr>
                                                    <td height="10"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Lato', sans-serif; font-size:12px; color:#757575; line-height:18px; font-weight: 300;">Digitalise your business with your very own iPhone and Android applications - Build a long-time customer relationship and best solution for on the go orders.</td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                     <tr>
                                        <td height="30"></td>
                                     </tr>
                                  </tbody>
                               </table>
                               <table class="col3" width="100%" border="0" align="right" cellpadding="0" cellspacing="0">
                                  <tbody>
                                     <tr>
                                        <td height="30"></td>
                                     </tr>
                                     <tr>
                                        <td align="center">
                                           <table class="insider" width="70%" border="0" align="center" cellpadding="0" cellspacing="0">
                                              <tbody>
                                                 <tr align="center" style="line-height:0px;">
                                                    <td style="">
                                                       <img src="https://cdn.dineorder.com/uploads/FILE-20201214-0725LD94D4NTL2ZJ.png" alt="" style="width: 50px">
                                                    </td>
                                                 </tr>
                                                 <tr>
                                                    <td height="15"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Raleway',  sans-serif; font-size:16px; color:#ff5800; line-height:24px; font-weight: 400;">Online Payment</td>
                                                 </tr>
                                                 <tr>
                                                    <td height="10"></td>
                                                 </tr>
                                                 <tr align="center">
                                                    <td style="font-family: 'Lato', sans-serif; font-size:12px; color:#757575; line-height:18px; font-weight: 300;">You don't have to look for a payment gateway integration. Its a hassle to get a merchant account and payment gateway for a business. We made it simple.</td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                     <tr>
                                        <td height="30"></td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                      </tbody>
                   </table>
                </td>
             </tr>
             <tr>
                <td height="5"></td>
             </tr>
             
             <!-- START WHAT WE DO -->
             <tr>
                <td align="center">
                   <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
                      <tbody>
                         <tr>
                            <td align="center">
                               <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" border-left: 1px solid #fff; border-right: 1px solid #fff; background: #f58a6812;">
                                  <tbody>
                                     <tr>
                                        <td height="50"></td>
                                     </tr>
                                     <tr>
                                        <td align="right">
                                           <table class="col2" width="287" border="0" align="right" cellpadding="0" cellspacing="0">
                                              <tbody>
                                                 <tr>
                                                    <td align="center" style="line-height:0px;">
                                                       <img style="display:block; line-height:0px; font-size:0px; border:0px;" class="images_style" src="https://dineorderpos.com/public/assets/img/feature-comp.png" width="269" height="138">
                                                    </td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                           <table width="287" border="0" align="left" cellpadding="0" cellspacing="0" class="col2" style="">
                                              <tbody>
                                                 <tr>
                                                    <td align="center">
                                                       <table class="insider" width="237" border="0" align="center" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                             <tr align="left">
                                                                <td style="font-family: 'Raleway', sans-serif; font-size:23px; color:#2a3b4c; line-height:30px; font-weight: 400;">How It <span style="color:#ff5800">Works?</span></td>
                                                             </tr>
                                                             <tr>
                                                                <td height="5"></td>
                                                             </tr>
                                                             <tr>
                                                                <td style="font-family: 'Lato', sans-serif; font-size:13px; color:#7f8c8d; line-height:20px; font-weight: 300;">
                                                                   We make your Online Order and Delivery Management Easy and Efficient
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                     <tr>
                                        <td height="50"></td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                         <!-- END WHAT WE DO -->
                         <!-- pricing -->
                         <tr>
                            <td align="center">
                               <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:20px; margin-right:20px;">
                                  <tbody>
                                     <tr>
                                        <td align="center">
                                           <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0" style=" border-left: 1px solid #fff; border-right: 1px solid #fff; background:     background: #f58a6812;">
                                              <tbody>
                                                 <tr>
                                                    <td height="50"></td>
                                                 </tr>
                                                 <tr>
                                                    <td align="right">
                                                       <table class="col2" width="250" border="0" align="left" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                             <tr>
                                                                <td align="center" style="line-height:0px;">
                                                                   <img style="display:block; line-height:0px; font-size:0px; border:0px;" class="images_style" src="https://dineorderpos.com/public/assets/img/price.png" width="169" height="138">
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                       <table width="347" border="0" align="right" cellpadding="0" cellspacing="0" class="col2" style="">
                                                          <tbody>
                                                             <tr>
                                                                <td align="center">
                                                                   <table class="insider" width="80%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                                      <tbody>
                                                                         <tr align="left">
                                                                            <td style="font-family: 'Raleway', sans-serif; font-size:23px; color:#2a3b4c; line-height:30px; font-weight: 400;">Simple <span style="color:#ff5800">Pricing?</span></td>
                                                                         </tr>
                                                                         <tr>
                                                                            <td height="5"></td>
                                                                         </tr>
                                                                         <tr>
                                                                            <td style="font-family: 'Lato', sans-serif; font-size:13px; color:#7f8c8d; line-height:20px; font-weight: 300;">
                                                                               ${mesaage}
                                                                            </td>
                                                                         </tr>
                                                                      </tbody>
                                                                   </table>
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                     <!-- pricing -->
                                     <!-- START FOOTER -->
                                     <tr>
                                        <td align="center">
                                           <table align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style=" border-left: 1px solid #fff; border-right: 1px solid #fff;">
                                              <tbody>
                                                 <tr>
                                                    <td height="50"></td>
                                                 </tr>
                                                 <tr>
                                                    <td align="center" bgcolor="" background="" height="145" style="border-top: 1px solid #ccc">
                                                       <table class="col-600" width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                                                          <tbody>
                                                             <tr>
                                                                <td height="25"></td>
                                                             </tr>
                                                             <tr>
                                                                <td align="center" style="font-family: 'Raleway',  sans-serif; font-size:16px; font-weight: 400; color:#333;">Follow us for some cool stuffs</td>
                                                             </tr>
                                                             <tr>
                                                                <td height="25"></td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                       <table align="center" width="25%" border="0" cellspacing="0" cellpadding="0">
                                                          <tbody>
                                                             <tr>
                                                                <td align="center" width="30%" style="vertical-align: top;">
                                                                   <a href="#" target="_blank">
                                                                   <img src="https://cdn.dineorder.com/uploads/FILE-20201214-07391GXE5F984M2M.png" alt="facebook">
                                                                   </a>
                                                                </td>
                                                                <td align="center" class="margin" width="30%" style="vertical-align: top;">
                                                                   <a href="#" target="_blank">
                                                                   <img src="https://cdn.dineorder.com/uploads/FILE-20201214-0731W5G4EUW841Q9.png" alt="twitter">
                                                                   </a>
                                                                </td>
                                                                <td align="center" width="30%" style="vertical-align: top;">
                                                                   <a href="#" target="_blank">
                                                                      <img src="https://cdn.dineorder.com/uploads/FILE-20201214-0759HYQJ76S15BAA.png" alt="google">
                                                                   </a>
                                                                </td>
                                                             </tr>
                                                          </tbody>
                                                       </table>
                                                    </td>
                                                 </tr>
                                              </tbody>
                                           </table>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                            </td>
                         </tr>
                         <!-- END FOOTER -->
                      </tbody>
                   </table>
       </body>
    </html>`;

    return a;
}



exports.getStoreDataOpenStatus = async function (req, storedetails, storeConfig) {
    storedetails.store_Open_Collection = 0;
    storedetails.store_Open_Delivery = 0;
    storedetails.store_Open_Time = '';
    storedetails.store_Open_Status = '';
    storedetails.store_Open_Collection_Time = '';
    storedetails.store_Open_Delivery_Time = '';
    if (storedetails.store_Collection == 0 && storedetails.store_Delivery == 0) {
        storedetails.store_Open_Collection = 0;
        storedetails.store_Open_Delivery = 0;
        storedetails.store_Open_Time = '';
        storedetails.store_Open_Status = 'Close';
        storedetails.store_Open_Delivery_Time = '';
        storedetails.store_Open_Collection_Time = '';
        return storedetails;
    }


    var store_Open_Collection = 0;
    var store_Open_Delivery = 0;
    var store_Open_Time = '';
    var store_Open_Status = '';
    var store_Open_Delivery_Time = '';
    var store_Open_Collection_Time = '';
    var store_configuration_Timing = "";
    var store_configuration_Timing_Collection = "";
    var store_configuration_Timing_Delivery = "";
    var store_configuration_Holiday = "";

    if (utility.checkEmpty(storeConfig)) {
        storedetails.store_Open_Status = 'Close';
        return storedetails;
    }
    else {
        store_configuration_Timing_Collection = storeConfig.store_configuration_Timing_Collection;
        store_configuration_Timing_Delivery = storeConfig.store_configuration_Timing_Delivery;
        store_configuration_Holiday = storeConfig.store_configuration_Holiday;
    }

    var now = req.locals.now;
    var today = now;
    var yesterday = utility.carbon.yesterday(req);
    var tomorrow = utility.carbon.tomorrow(req);

    var curTime = utility.carbon.format(now, 'HHmm');
    var curDay = utility.carbon.format(now, 'd');
    if (curDay == 0) { curDay = 7; }
    var minInterval = 5;

    var timestringDate = utility.carbon.format(now, 'YYYY-MM-DD HH:mm:00');
    var timestring = utility.carbon.strtotime(req, timestringDate);

    var rounded_seconds = (Math.floor(timestring / (minInterval * 60)) * (minInterval * 60)) * 1000;
    var startTime = utility.carbon.format(rounded_seconds, 'HHmm');//date('Hi', rounded_seconds);

    rounded_seconds = (Math.ceil(timestring / (5 * 60)) * (5 * 60)) * 1000;
    var endTime = utility.carbon.format(rounded_seconds, 'HHmm');
    var timeRange = "";
    if (startTime == endTime) {
        timeRange = "" + curDay + '' + endTime + "";
    } else if (endTime == '0000') {
        timeRange = "" + curDay + '' + startTime + ':' + curDay + '' + '2359' + "";
    } else {
        timeRange = "" + curDay + '' + startTime + ':' + curDay + '' + endTime + "";
    }

    if (storedetails.store_Collection == 1) {

        if (_s.include(store_configuration_Timing_Collection, timeRange)) {
            store_Open_Collection = 1;
        }
    }
    if (storedetails.store_Delivery == 1) {
        if (_s.include(store_configuration_Timing_Delivery, timeRange)) {
            store_Open_Delivery = 1;
        }
    }

    var isOpen = 1;

    var holidays = "";
    var todayDate = "";
    var storeTiming = "";
    var storeTimings = "";
    var ytrDate = "";
    var openday = "";
    var holiday = "";
    var hld = "";
    var storeTmg = "";
    if (!utility.checkEmpty(store_configuration_Holiday)) {
        holidays = store_configuration_Holiday.split(',');
        todayDate = utility.carbon.format(now, 'YYYY-MM-DD');

        storeTiming = store_configuration_Timing_Collection + ',' + store_configuration_Timing_Delivery;
        storeTimings = storeTiming.split(',');

        ytrDate = utility.carbon.format(yesterday, 'YYYY-MM-DD');

        for (var strtmg in storeTimings) {
            storeTmg = storeTimings[strtmg];

            if (_s.include(storeTmg, timeRange)) {
                openday = parseInt(storeTmg.substring(0, 1));
                if (openday == curDay) {
                    for (hld in holidays) {
                        holiday = holidays[hld];
                        if (todayDate == holiday) {
                            isOpen = 0;
                            break;
                        }
                    }
                } else if (openday < curDay) {
                    for (hld in holidays) {
                        holiday = holidays[hld];
                        if (ytrDate == holiday) {
                            isOpen = 0;
                            break;
                        }
                    }
                }
            }
            if (isOpen == 0) {
                break;
            }
        }

        if (isOpen == 1) {
            storeTiming = store_configuration_Timing_Collection + ',' + store_configuration_Timing_Delivery;
            storeTimings = storeTiming.split(',');
            ytrDate = utility.carbon.format(yesterday, 'YYYY-MM-DD');

            for (var strtmg2 in storeTimings) {
                storeTmg = storeTimings[strtmg2];
                if (_s.include(storeTmg, timeRange)) {
                    openday = parseInt(storeTmg.substring(0, 1));
                    if (curDay != openday) {
                        for (var hld3 in holidays) {
                            holiday = holidays[hld3];
                            if (ytrDate == holiday) {
                                isOpen = 0;
                                break;
                            }
                        }
                    }
                }
                if (isOpen == 0) {
                    break;
                }
            }

        }
        if (isOpen == 0) {
            store_Open_Collection = 0;
            store_Open_Delivery = 0;
        }
    }

    var from_def_coll = false;
    if (store_Open_Collection == 1) {
        from_def_coll = true;
    }

    var from_def_del = false;
    if (store_Open_Delivery == 1) {
        from_def_del = true;
    }

    var from_pre = false;
    var from_pre_coll = false;
    if (storedetails.store_Collection == 1 && store_Open_Collection == 0 && storedetails.store_Preorder == 'Yes') {
        store_Open_Collection = 1;
        from_pre = true;
        from_pre_coll = true;
    }
    var from_pre_del = false;
    if (storedetails.store_Delivery == 1 && store_Open_Delivery == 0 && storedetails.store_Preorder == 'Yes') {
        store_Open_Delivery = 1;
        from_pre = true;
        from_pre_del = true;
    }

    store_Open_Status = 'Close';

    if (from_def_coll || from_def_del) {
        store_Open_Status = 'Add';
    } else {
        if (from_pre) {
            store_Open_Status = 'Pre Order';
        } else {
            if (store_Open_Collection == 1 || store_Open_Delivery == 1) {
                store_Open_Status = 'Add';
            }
        }
    }

    var dayCount = "";
    var hr = '00';
    var mn = '00';
    if (store_Open_Status == 'Close' || (from_pre_coll || from_pre_del)) {
        if (isOpen == 0) {
            now = tomorrow;
        } else {
            now = today;
        }

        curDay = utility.carbon.format(now, 'd');
        if (curDay == 0) { curDay = 7; }
        store_Open_Collection_Time = '';
        storeTiming = store_configuration_Timing_Collection;
        storeTimings = storeTiming.split(',');
        ytrDate = utility.carbon.format(now, 'YYYY-MM-DD');
        dayCount = 1;
        var timingData = "";
        var dummyFirstDate = "";

        var gotoexit = 0;
        var start_date = "";
        changeDayColl:
        while (gotoexit == 0) {
            gotoexit = 1;
            for (var strtmg3 in storeTimings) {
                storeTmg = storeTimings[strtmg3];
                openday = parseInt(storeTmg.substring(0, 1));
                if (curDay == openday) {
                    timingData = storeTmg.split(':');
                    timingData = "" + timingData[0] + "";
                    timingData = timingData.substr(1);
                    hr = timingData.substr(0, 2);
                    mn = timingData.substr(2, 4);
                    timingData = hr + ":" + mn;
                    dummyFirstDate = utility.carbon.format(now, 'YYYY-MM-DD');

                    start_date = utility.carbon.format(dummyFirstDate + ' ' + timingData, 'YYYY-MM-DD HH:mm:ss');//Carbon::parse(dummyFirstDate.timingData);
                    store_Open_Time = start_date;
                    if (utility.carbon.isGreater(today, store_Open_Time)) {
                        if (dayCount <= 3) {
                            now = utility.carbon.format(dummyFirstDate + ' 00:01', 'YYYY-MM-DD HH:mm:ss');//Carbon::parse(dummyFirstDate+'0001');
                            now = utility.carbon.addDay(now, 1);
                            dayCount++;
                            curDay++;
                            if (curDay == 8) { curDay = 1; }
                            gotoexit = 0;
                            continue changeDayColl;
                        }
                    }
                    store_Open_Collection_Time = store_Open_Time;
                }
            }
        }
        if (store_Open_Status == 'Add' && !from_pre_coll) {
            store_Open_Collection_Time = '';
        }

        if (isOpen == 0) {
            now = tomorrow;
        } else {
            now = today;
        }

        curTime = utility.carbon.format(now, 'HHmm');
        curDay = curDay = utility.carbon.format(now, 'd');
        if (curDay == 0) { curDay = 7; }

        store_Open_Delivery_Time = '';
        storeTiming = store_configuration_Timing_Delivery;
        storeTimings = storeTiming.split(',');
        ytrDate = utility.carbon.format(now, 'YYYY-MM-DD');
        dayCount = 1;
        gotoexit = 0;
        changeDayDel: while (gotoexit == 0) {
            gotoexit = 1;
            for (var strtmg4 in storeTimings) {
                storeTmg = storeTimings[strtmg4];
                openday = parseInt(storeTmg.substr(0, 1));
                if (curDay == openday) {
                    timingData = storeTmg.split(':');
                    timingData = "" + timingData[0] + "";
                    timingData = timingData.substr(1);
                    hr = timingData.substr(0, 2);
                    mn = timingData.substr(2, 4);
                    timingData = hr + ":" + mn;
                    dummyFirstDate = utility.carbon.format(now, 'YYYY-MM-DD');
                    start_date = utility.carbon.format(dummyFirstDate + ' ' + timingData, 'YYYY-MM-DD HH:mm:ss');
                    store_Open_Time = start_date;
                    if (utility.carbon.isGreater(today, store_Open_Time)) {
                        if (dayCount <= 3) {
                            now = utility.carbon.format(dummyFirstDate + ' 00:01', 'YYYY-MM-DD HH:mm:ss');
                            now = utility.carbon.addDay(now, 1);
                            dayCount++;
                            curDay++;
                            if (curDay == 8) { curDay = 1; }
                            gotoexit = 0;
                            continue changeDayDel;
                        }
                    }
                    store_Open_Delivery_Time = store_Open_Time;
                }
            }
        }

        if (store_Open_Status == 'Add' && !from_pre_del) {
            store_Open_Delivery_Time = '';
        }
        if (!utility.checkEmpty(store_Open_Collection_Time) && !utility.checkEmpty(store_Open_Delivery_Time)) {
            if (store_Open_Collection_Time < store_Open_Delivery_Time) {
                store_Open_Time = store_Open_Collection_Time;
            } else {
                store_Open_Time = store_Open_Delivery_Time;
            }

            store_Open_Collection_Time = utility.carbon.format(store_Open_Collection_Time, 'hh:mm A');
            store_Open_Delivery_Time = utility.carbon.format(store_Open_Delivery_Time, 'hh:mm A');
            store_Open_Time = utility.carbon.format(store_Open_Time, 'hh:mm A');
        }
        else {
            if (!utility.checkEmpty(store_Open_Collection_Time)) {
                store_Open_Time = store_Open_Collection_Time;
                store_Open_Collection_Time = utility.carbon.format(store_Open_Collection_Time, 'hh:mm A');
                store_Open_Time = utility.carbon.format(store_Open_Time, 'hh:mm A');
            }
            if (!utility.checkEmpty(store_Open_Delivery_Time)) {
                store_Open_Time = store_Open_Delivery_Time;
                store_Open_Delivery_Time = utility.carbon.format(store_Open_Delivery_Time, 'hh:mm A');
                store_Open_Time = utility.carbon.format(store_Open_Time, 'hh:mm A');
            }
        }
    }

    storedetails.store_Open_Collection = store_Open_Collection;
    storedetails.store_Open_Delivery = store_Open_Delivery;
    storedetails.store_Open_Time = store_Open_Time;
    storedetails.store_Open_Status = store_Open_Status;
    storedetails.store_Open_Collection_Time = store_Open_Collection_Time;
    storedetails.store_Open_Delivery_Time = store_Open_Delivery_Time;
    return storedetails;
};

exports.platFormVersion = (req) => {
    let response = {};
    response = {
        "Android": {
            "version": "9004",
            "force": true
        },
        "iOS": {
            "version": "9004",
            "force": true
        },
        "pax": {
            "version": "8000",
            "force": false
        },
        "macOS": {
            "version": "8000",
            "force": false
        },
        "web": {
            "version": "8000",
            "force": false
        },
        "linux": {
            "version": "8000",
            "force": false
        },
        "kuickccapp": {
            "Android": {
                "version": "9004",
                "force": true
            },
            "iOS": {
                "version": "9004",
                "force": true
            },
            "pax": {
                "version": "8000",
                "force": false
            },
            "macOS": {
                "version": "8000",
                "force": false
            },
            "web": {
                "version": "8000",
                "force": false
            },
            "linux": {
                "version": "8000",
                "force": false
            }
        }
    };


    return response;
}

exports.getActiveModules = (req) => {
    let response = {};
    response = {
        "Admin": {
            "footer_menu": {
                "dashboard": "unlocked",
                "live_order": "unlocked",
                "more": "unlocked"
            },
            "left_menu": {
                "dashboard": "unlocked",
                "store_properties": "unlocked",
                "banking_details": "unlocked",
                "reports": "unlocked",
                "manage_menu": "unlocked",
                "manage_staff": "unlocked",
                "marketing_tools": "unlocked",
                "rules_conditions": "unlocked",
                "discount_loyalty": "unlocked",
                "manage_customer": "unlocked"
            }
        },
        "Staff": {
            "footer_menu": {
                "dashboard": "unlocked",
                "live_order": "unlocked",
                "more": "unlocked"
            },
            "left_menu": {
                "dashboard": "unlocked",
                "store_properties": "unlocked",
                "banking_details": "unlocked",
                "reports": "unlocked",
                "manage_menu": "unlocked",
                "manage_staff": "unlocked",
                "marketing_tools": "unlocked",
                "rules_conditions": "unlocked",
                "discount_loyalty": "unlocked",
                "manage_customer": "unlocked"
            }
        },
        "Driver": {
            "footer_menu": {
                "dashboard": "unlocked",
                "live_order": "unlocked",
                "more": "unlocked"
            },
            "left_menu": {
                "dashboard": "unlocked",
                "store_properties": "unlocked",
                "banking_details": "unlocked",
                "reports": "unlocked",
                "manage_menu": "unlocked",
                "manage_staff": "unlocked",
                "marketing_tools": "unlocked",
                "rules_conditions": "unlocked",
                "discount_loyalty": "unlocked",
                "manage_customer": "unlocked"
            }
        }
    };
    return response;
}

exports.formatGetReportDate = (req, now, fromdate, untildate) => {
    let response = {};
    //console.log('before - ', fromdate, ' ====== ', untildate);
    if (fromdate == untildate) {
        fromdate = utility.carbon.parse(fromdate);
        let dayfromdate = utility.carbon.format(fromdate, 'YYYY-MM-DD');
        let daynow = utility.carbon.format(now, 'YYYY-MM-DD');
        // if (dayfromdate == daynow) {
        //     fromdate = utility.carbon.parse(dayfromdate + " 05:00:00");
        //     untildate = utility.carbon.addDay(fromdate, 1);
        // } else {
        //     fromdate = utility.carbon.addDay(fromdate, -1);
        //     fromdate = utility.carbon.parse(fromdate + " 05:00:00");
        //     untildate = utility.carbon.parse(dayfromdate + " 05:00:00");
        // }
        fromdate = utility.carbon.parse(dayfromdate + " 05:00:00");
        untildate = utility.carbon.addDay(fromdate, 1);
    }
    fromdate = utility.carbon.parse(fromdate);
    untildate = utility.carbon.parse(untildate);
    response.fromdate = fromdate;
    response.untildate = untildate;
    return response;
}

exports.genReferralCode = function (pre, Id, len) {
    let newCode = pre + Id;
    return newCode;
};
exports.run_axios_api = async function (req, url, httpMethod, header, data) {

    var config = {
        method: httpMethod,
        url: url,
        headers: header,
        data: data
    };

    var val = "";

    await axios(config)
        .then(function (response) {
            val = JSON.stringify(response.data);
            val = response.data;//JSON.parse(val)
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                //console.log(error.response.data);
                val = error.response.data;
                //console.log(error.response.status);
                //console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                //console.log('Error', error.message);
            }
            //console.log(error.config);
        });

    return val
};


exports.maskTelephone = function (str) {
    if (utility.checkEmpty(str)) {
        return '';
    }
    str = '' + str;
    str = str.slice(0, -4);
    str = `${str}XXXX`;
    return str;
};
exports.maskTelephoneParam = function (str, sfx) {
    if (utility.checkEmpty(str)) {
        return '';
    }
    str = '' + str;
    str = str.slice(0, -4);
    str = `${str}` + '' + sfx;
    return str;
};

exports.maskEmail = function (str) {
    if (utility.checkEmpty(str)) {
        return '';
    }
    str = '' + str;
    let emailstr = str.split('@');
    if (utility.checkEmpty(emailstr) || utility.checkEmpty(emailstr[0]) || utility.checkEmpty(emailstr[1])) {
        return str;
    }
    let str1 = emailstr[0].slice(0, -4);
    str1 = `${str1}XXXX`;
    str = str1 + '@' + emailstr[1];
    return str;
};


exports.successApiResponse = async function (req, res, response) {
    if (!utility.checkEmpty(req.locals.apptech) && (req.locals.apptech == 'fpos'  || req.locals.apptech == 'fcms' )) {
        response = await utility.nestedObjToStr(req, response);
    }
    return res.status(200).json(response);
};

exports.unauthorizedApiResponse = async function (req, res, response) {
    if (!utility.checkEmpty(req.locals.apptech) && (req.locals.apptech == 'fpos' || req.locals.apptech == 'fcms' )) {
        response = await utility.nestedObjToStr(req, response);
    }
    return res.status(401).json(response);
};


exports.accessforbiddenApiResponse = async function (req, res, response) {
    if (!utility.checkEmpty(req.locals.apptech) && req.locals.apptech == 'fpos') {
        response = await utility.nestedObjToStr(req, response);
    }
    return res.status(403).json(response);
};

exports.notfoundApiResponse = async function (req, res, response) {
    if (!utility.checkEmpty(req.locals.apptech) && (req.locals.apptech == 'fpos' || req.locals.apptech == 'fcms' )) {
        response = await utility.nestedObjToStr(req, response);
    }
    return res.status(404).json(response);
};


exports.nestedObjToStr = async function (req, objData) {
    if (utility.checkEmpty(objData)) {
        return objData;
    }
    var resObj = {};
    resObj = await utility.nestedObjToStrRec(req, objData);

    return resObj;
};

exports.nestedObjToStrRec = async function (req, objData) {
    if (utility.checkEmpty(objData)) {
        if (typeof objData == 'object') {
            return objData;
        }
        return '' + objData;
    }

    if (typeof objData == 'object') {
        for (let k in objData) {
            if (!utility.checkEmpty(objData[k])) {

            }
            objData[k] = await utility.nestedObjToStrRec(req, objData[k]);
        }
    } else {
        objData = '' + objData;
    }

    return objData;
};

exports.getCryptSecret = async function (req, objData) {

    return objData;
};

exports.objtoArrFpos = async function (req, objData) {
    let objData_f = [];
    for (let k in objData) {
        let dv = {};
        dv.key = k;
        dv.val = objData[k];
        objData_f.push(dv);
    }
    return objData_f;
};


exports.parseFromUntillDate = async (req, curtime) => {
    var { now, storedetails } = req.locals;
    //var Time = await methods.getStoreCurrentTime(req, store_Id);
    // var openTime = Time['opentime'];
    // var closeTime = Time['closetime'];

    var openTime = '';
    var closeTime = '';
    now = curtime;
    let optime = curtime;
    let ytrday = utility.carbon.yesterday(req);
    let tomorrow = utility.carbon.tomorrow(req);
    let optimeDate = optime;
    let optimeStartCheck = utility.carbon.format(optime, 'YYYY-MM-DD 00:00:00');
    let optimeCloseCheck = utility.carbon.format(optime, 'YYYY-MM-DD 05:00:00');

    if (utility.carbon.isGreaterOrEqual(now, optimeStartCheck) && utility.carbon.isLessOrEqual(now, optimeCloseCheck)) {
        optimeStartCheck = utility.carbon.format(ytrday, 'YYYY-MM-DD 05:00:00');
        optimeCloseCheck = utility.carbon.format(now, 'YYYY-MM-DD 05:00:00');
    } else {
        optimeStartCheck = utility.carbon.format(now, 'YYYY-MM-DD 05:00:00');
        optimeCloseCheck = utility.carbon.format(tomorrow, 'YYYY-MM-DD 05:00:00');
    }
    openTime = optimeStartCheck;
    closeTime = optimeCloseCheck;

    var curTimeData = {};
    curTimeData.from = openTime;
    curTimeData.untill = closeTime;


    return curTimeData;
};

exports.verifyAuthKey = async function (req, postData, xAppname, xtoken) {
    var isValid = 0;
    var appsecret = constants.vals.secretKeys[constants.vals.app_env][xAppname];
    // console.log('appsecret - ', xAppname, appsecret);
    if (utility.checkEmpty(appsecret)) {
        isValid = 0;
        return isValid;
    }

    postData = JSON.stringify(postData);
    let signature = crypto.createHmac('sha1', appsecret).update(postData).digest('hex');
    //console.log('signature - ', signature, ' - ', xtoken);
    if (signature === xtoken) {
        isValid = 1;
    }
    return isValid;
};

exports.getDatesArrayFromRangePeriod = (start, end, period, format ) => { 
	let dateArray = [];
	let currentDate = moment(start);
	let stopDate = moment(end);
    let periodType;

    if(period === '1D'){
        periodType = 'days';
    } else if (period === '1W') {
        periodType = 'W'
    } else {
        periodType = 'M'
    }
	while (currentDate <= stopDate) {
    if (period === '1W' || period === '1M') {
      console.log(utility.carbon.isLessOrEqual(moment(currentDate).add(1, periodType).subtract(1, 'days'),stopDate));
      if (utility.carbon.isLessOrEqual(moment(currentDate).add(1, periodType).subtract(1, 'days'),stopDate)) {
        dateArray.push(moment(currentDate).format(format) + ' - '+ moment(currentDate).add(1, periodType).subtract(1, 'days').format(format)) 
      }
      else {
        dateArray.push(moment(currentDate).format(format) + ' - '+ stopDate.format(format));
      }
    } else {
      dateArray.push(moment(currentDate).format(format))
    }
		currentDate = moment(currentDate).add(1, periodType);
	}
  return dateArray;
}
exports.array_chunk = (arr, size) =>{
    let chunks = [],
    i = 0,
    n = arr.length;

    while (i < n) {
        chunks.push(arr.slice(i, i += size));
    }
    
    return chunks;
};

exports.groupByKey = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
       const key = obj[property];
       if (!acc[key]) {
          acc[key] = [];
       }
       acc[key].push(obj);
       return acc;
    }, {});
}

exports.encApiResponse = async function (req, res, response) {
    response = await utility.nestedObjToStr(req, response);

    let resobj = {};
    resobj.response = utility.encryptcipher2(response);
    return res.status(200).json(resobj);
};

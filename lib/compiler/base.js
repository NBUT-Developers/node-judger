"use strict";

const os = require("os");

const base = {};

base.middlePath = os.tmpdir();

base.setMiddlePath = function(middle) {
    this.middlePath = middle;
};

base.replaceWithCannotRegexp = function(str, find, replace) {
    let before;
    let after = str;
    do {
        before = after;
        after = before.replace(find, replace);
    } while(after !== before);

    return after;
};

module.exports = base;
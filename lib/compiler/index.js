"use strict";

module.exports.get = function(type) {
    return require(`./${type}`);
};
"use strict";

const path = require("path");

const JudgerCore = {};

JudgerCore.run = function(exePath, command, input, time, memo, callback) {
    return process.nextTick(function() {
        callback(undefined, {
            time: 255,
            memo: 1021,
            state: 0,
            message: "",
            output: path.resolve(__dirname, "../examples/middle/dummy_output")
        });
    });
};

module.exports = JudgerCore;

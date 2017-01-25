"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const async = require("async");
const uuid = require("uuid");

const base = require("./base");
const result = require("../result");

const cpp = {};
let compilerPath = "";
let compilerOptions = [];

cpp.compile = function(sourceCode, callback) {
    const id = uuid.v1();
    const sourceName = path.resolve(base.middlePath, `${id}.cpp`);
    const exeName = path.resolve(base.middlePath, `${id}.exe`);
    const args = [ sourceName, "-o", exeName ].concat(compilerOptions);
    const ret = {
        state: result.FINISHED,
        message: "",
        exeName: "",
        sourceName: ""
    };
    async.waterfall([
        function(callback) {
            fs.writeFile(sourceName, sourceCode, { encoding: "utf8" }, function(err) {
                callback(err);
            });
        },

        function(callback) {
            ret.sourceName = sourceName;
            cp.execFile(compilerPath, args, {
                timeout: 2000
            }, function(err, stdout, stderr) {
                if(err) {
                    if(!stderr) {
                        return callback(err);
                    }
                }

                if(stderr) {
                    ret.state = result.COMPILATION_ERROR;
                    stderr = base.replaceWithCannotRegexp(stderr, sourceName, "fake.cpp");
                    stderr = stderr.replace(/[a-zA-Z]:[\\\/].*[\\\/](.*?): /g, "X:/fakepath/$1: ");
                    ret.message = stderr;
                } else {
                    ret.state = result.COMPILATION_SUCC;
                    ret.exeName = exeName;
                }

                return callback();
            });
        }
    ], function(err) {
        if(err) return callback(err);
        return callback(undefined, ret);
    });
};

cpp.setCompilerPath = function(filename) {
    compilerPath = path.normalize(filename);
};

cpp.setCompilerAdditionalOptions = function(options) {
    compilerOptions = options;
};

module.exports = cpp;

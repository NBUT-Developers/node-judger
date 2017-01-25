"use strict";

"use strict";

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const async = require("async");
const uuid = require("uuid");

const base = require("./base");
const result = require("../result");

const pascal = {};
let compilerPath = "";
let compilerOptions = [];

pascal.compile = function(sourceCode, callback) {
    const id = uuid.v1();
    const sourceName = path.resolve(base.middlePath, `${id}.pas`);
    const exeName = path.resolve(base.middlePath, `${id}.exe`);
    const args = [ sourceName, `-o${exeName}` ].concat(compilerOptions);
    const ret = {
        state: result.FINISHED,
        message: "",
        exeName: "",
        sourceName: "",
        oName: path.resolve(base.middlePath, `${id}.o`)
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
                    if(!stderr && !stdout) {
                        return callback(err);
                    }

                    if(stdout) {
                        ret.state = result.COMPILATION_ERROR;
                        stdout = base.replaceWithCannotRegexp(stdout, `${id}.pas`, "fake.pas");
                        stdout = stdout.replace(/Error: .*\\(.*) returned an error exitcode/g, "Error: $1 returned an error exitcode");
                        stdout = stdout.replace(/Linking .*\\(.*)\.exe/g, "Linking fake.exe");
                        ret.message = stdout;
                        return callback();
                    }
                }

                if(stderr) {
                    ret.state = result.COMPILATION_ERROR;
                    stderr = base.replaceWithCannotRegexp(stderr, `${id}.pas`, "fake.pas");
                    stderr = stderr.replace(/Error: .*\\(.*) returned an error exitcode/g, "Error: $1 returned an error exitcode");
                    stderr = stderr.replace(/Linking .*\\(.*)\.exe/g, "Linking fake.exe");
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

pascal.setCompilerPath = function(filename) {
    compilerPath = path.normalize(filename);
};

pascal.setCompilerAdditionalOptions = function(options) {
    compilerOptions = options;
};

module.exports = pascal;

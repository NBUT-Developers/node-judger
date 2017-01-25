"use strict";

const async = require("async");
const fs = require("fs-extra");
const JudgerCore = process.platform === "win32" ?
    require("judger-core") :
    require("./dummy_judger_core");

require("./dlls");
const compiler = require("./compiler");
const _File = require("../build/Release/file");
const StateResult = require("./result");

class Judger {
    constructor(source, _compiler, stdIn, stdOut, time, memo) {
        this.source = source;
        this.input = stdIn;
        this.output = stdOut;
        this.time = time;
        this.memo = memo;
        this.compiler = compiler.get(_compiler);
        this.middles = {};
    }

    compile(callback) {
        const self = this;
        this.compiler.compile(this.source, function(err, result) {
            if(result && result.exeName) {
                self.middles.exe = result.exeName;
            }

            if(result && result.sourceName) {
                self.middles.source = result.sourceName;
            }

            if(result && result.oName) {
                self.middles.o = result.oName;
            }

            return callback(err, {
                state: result ?
                    result.state || StateResult.SYSTEM_ERROR :
                    StateResult.SYSTEM_ERROR,
                message: result ?
                    result.message || (err && err.message) || "" :
                    err.message
            });
        });
    }

    judge(callback) {
        const self = this;
        JudgerCore.run(this.middles.exe, "", this.input, this.time, this.memo, function(err, res) {
            if(res && res.output) {
                self.middles.output = res.output;
            }

            if(err) {
                return callback(err, res);
            }

            if(res.state === StateResult.FINISHED) {
                setTimeout(function() {
                    Judger._judgeFile(res.output, self.output, function(err, code) {
                        if(err) {
                            return callback(err, res);
                        }

                        res.state = code;
                        return callback(undefined, res);
                    });
                }, 1000);
            } else {
                return callback(undefined, res);
            }
        });
    }

    clean(callback) {
        const middles = this.middles;
        async.eachLimit(Object.keys(middles), 5, function(key, callback) {
            const path = middles[key];
            fs.remove(path, function(err) {
                return callback(err);
            });
        }, function(err) {
            return callback(err);
        });
    }
};

Judger._judgeFile = function(output, std, callback) {
    async.waterfall([
        function(callback) {
            fs.stat(output, function(err, stat1) {
                if(err) {
                    err = new Error("Can't get output size.");
                    err.code = StateResult.SYSTEM_ERROR;
                    return callback(err);
                }

                fs.stat(std, function(err, stat2) {
                    if(err) {
                        err = new Error("Can't get std output size.");
                        err.code = StateResult.SYSTEM_ERROR;
                        return callback(err);
                    }

                    if(stat1.size > stat2.size * 2) {
                        const err = new Error("Output limit exceeded.");;
                        err.code = StateResult.OUTPUT_LIMIT_EXCEEDED;
                        return callback(err);
                    }

                    return callback();
                });
            });
        },

        function(callback) {
            _File.judge(output, std, function(err, result) {
                if(result === "") {
                    const err = new Error("Unknown file judge error");
                    err.code = StateResult.SYSTEM_ERROR;
                    return callback(err);
                } else if(result === "ACCEPTED") {
                    return callback(undefined, StateResult.ACCEPTED);
                } else if(result === "WRONG_ANSWER") {
                    return callback(undefined, StateResult.WRONG_ANSWER);
                } else if(result === "PRESENTATION_ERROR") {
                    return callback(undefined, StateResult.PRESENTATION_ERROR);
                } else {
                    const err = new Error(result);
                    err.code = StateResult.SYSTEM_ERROR;
                    return callback(err);
                }
            });
        }
    ], function(err, result) {
        return callback(err, result);
    });
};

module.exports = Judger;
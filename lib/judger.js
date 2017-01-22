"use strict";

const async = require("async");
const fs = require("fs-extra");
const JudgeCore = require("judger-core");

const compiler = require("./compiler");

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
            if(result.exeName) {
                self.middles.exe = result.exeName;
            }

            if(result.sourceName) {
                self.middles.source = result.sourceName;
            }

            return callback(err, {
                state: result.state,
                message: result.message
            });
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

module.exports = Judger;
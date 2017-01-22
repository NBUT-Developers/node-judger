"use strict";

const fs = require("fs");
const Module = require("module");

const filename = Module._resolveFilename("judger-core/src/common.h", module, false);
const source = fs.readFileSync(filename, { encoding: "utf8" });

const regResult = /enum StateEnum {\s*([\s\S]*)\s*};\s*struct CodeState {/.exec(source);
if(regResult.length < 2) throw new Error("Broken source code file.");

const resultStr = regResult[1].trim();
const result = resultStr.split("\n").reduce((result, line) => {
    line = line.trim().split("=");
    line[0] = line[0].trim();
    line[1] = line[1].trim();
    if(line[1][line[1].length - 1] === ",") {
        line[1] = line[1].substr(0, line[1].length - 1);
    }

    result[line[0]] = parseInt(line[1]);
    return result;
}, {});

result.COMPILATION_ERROR = 100;
result.COMPILATION_SUCC = 101;

module.exports = result;
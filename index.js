"use strict";

const Judger = module.exports = require("./lib/judger");

const base = require("./lib/compiler/base");
Judger.setMiddlePath = base.setMiddlePath.bind(base);

const c = require("./lib/compiler/c");
Judger.setCCompilerPath = c.setCompilerPath.bind(c);
Judger.setCCompilerOptions = c.setCompilerAdditionalOptions.bind(c);

const cpp = require("./lib/compiler/c++");
Judger.setCPPCompilerPath = cpp.setCompilerPath.bind(cpp);
Judger.setCPPCompilerOptions = cpp.setCompilerAdditionalOptions.bind(cpp);

const pascal = require("./lib/compiler/pascal");
Judger.setPascalCompilerPath = pascal.setCompilerPath.bind(pascal);
Judger.setPascalCompilerOptions = pascal.setCompilerAdditionalOptions.bind(pascal);
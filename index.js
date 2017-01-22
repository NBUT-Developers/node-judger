"use strict";

const Judger = module.exports = require("./lib/judger");

const base = require("./lib/compiler/base");
Judger.setMiddlePath = base.setMiddlePath.bind(base);

const c = require("./lib/compiler/c");
Judger.setCCompilerPath = c.setCompilerPath.bind(c);
Judger.setCCompilerOptions = c.setCompilerAdditionalOptions.bind(c);
"use strict";

const path = require("path");

require("./pre");

const source = `
#include <stdio.h>

int main()
{

}`;

const Judger = require("../");
const judger = new Judger(source, "c", "input", path.resolve(__dirname, "middle/stdout"), 1000, 65535);

judger.compile(function(err, ret) {
    console.log(err, ret);

    judger.judge(function(err, res) {
        console.log(err, res);
        judger.clean(function(err) {
            console.log(err);
        });
    });
});
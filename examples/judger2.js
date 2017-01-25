"use strict";

const path = require("path");

require("./pre");

const source = `
#include <stdio.h>

int main()
{
    int a, b;
    while(~scanf("%d%d", &a, &b))
    {
        printf("%d\\n", a + b);
    }
    return 0;
}`;

const Judger = require("../");
const judger = new Judger(source, "c++", path.resolve(__dirname, "middle/stdin"), path.resolve(__dirname, "middle/stdout"), 1000, 65535);

judger.compile(function(err, ret) {
    if(err) {
        return judger.clean(function() {
            console.log(err);
        });
    }

    if(ret.state === Judger.ResultState.COMPILATION_ERROR) {
        return judger.clean(function() {
            console.log("Compile failed:", ret.message);
        });
    }

    judger.judge(function(err, res) {
        console.log(err, res);
        judger.clean(function(err) {
            console.log(err);
        });
    });
});
"use strict";

require("./pre");

const source = `
#include <stdio.h>

int main()
{

}`;

const Judger = require("../");
const judger = new Judger(source, "c", "input", "output", 1000, 65535);

judger.compile(function(err, ret) {
    console.log(err, ret);

    judger.clean(function(err) {
        console.log(err);
    });
});
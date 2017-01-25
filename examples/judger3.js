"use strict";

const path = require("path");

require("./pre");

const source = `
program NBUT1000;
var a,b:integer;
begin
  readln(a,b);
  while(a<>0)and(b<>0)do
  begin
    writeln(a+b);
    read(a,b);
  end;
end.`;

const Judger = require("../");
const judger = new Judger(source, "pascal", path.resolve(__dirname, "middle/stdin"), path.resolve(__dirname, "middle/stdout"), 1000, 65535);

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
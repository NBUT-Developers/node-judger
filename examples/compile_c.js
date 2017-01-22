const path = require("path");

require("./pre");
const c = require("../lib/compiler/c");

c.compile("#include <stdio.h>\nvoid main() {}", function(err, ret) {
    console.log(err, ret);
});
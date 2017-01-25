"use strict";

const JudgerCore = require("judger-core");

const dlls = [
    "ntdll.dll",
    "kernel32.dll",
    "KernelBase.dll",
    "msvcrt.dll",
    "wow64.dll",
    "wow64win.dll",
    "wow64cpu.dll",
    "user32.dll"
];

dlls.forEach(dll => JudgerCore.addSupportedDLL(dll));
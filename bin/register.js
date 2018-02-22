#! /usr/bin/env node
var fs = require("fs")
var current_dir = process.cwd()
var packageJson = require(current_dir + "/package.json")
var framework_loc = current_dir + "/dist/measurement-framework.js"

fs.symlink(framework_loc, '~/.rmf-scripts/bohus.js', function (res) {
    console.log(res)
})

//console.log(packageJson)
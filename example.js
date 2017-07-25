'use strict'

const queryOverpass = require('.')

queryOverpass(`\
[out:json][timeout:25];
node(3378340880);
out body;`)
.then(console.log)
.catch(console.error)

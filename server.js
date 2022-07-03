#!/usr/bin/env node

const express = require('express');

const app = express();
const port = 3001;

app.use('/', express.static('ui'));

app.listen(port, () => {
    console.log(new Date(), `Server started on port ${port}`)
});

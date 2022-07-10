#!/usr/bin/env node

const express = require('express');

const app = express();
const port = 3001;

app.use('/500w', express.static('docs'));

app.listen(port, () => {
    console.log(new Date(), `Server started on http://localhost:${port}/500w`)
});

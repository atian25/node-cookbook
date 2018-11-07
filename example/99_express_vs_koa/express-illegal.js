'use strict';

const express = require('express');
const app = new express();

function doTask(seq, done) {
  console.log(`${seq} start`);
  done();
}

function doAsyncTask(seq, done) {
  setTimeout(() => {
    console.log(`${seq} start`);
    done();
  }, 100);
}

app.use((req, res, next) => {
  console.log('\n\n--- new request ---');
  next();
});

app.use('/sync', (req, res, next) => {
  doTask(1, next);
  console.log('1 done');
});

app.use('/sync', (req, res, next) => {
  doTask(2, next);
  console.log('2 done');
});

app.use('/async', (req, res, next) => {
  doAsyncTask(1, next);
  console.log('1 done');
});

app.use('/async', (req, res, next) => {
  doAsyncTask(2, next);
  console.log('2 done');
});

app.use((req, res) => {
  console.log('response');
  res.end('done');
});

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});

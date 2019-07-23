'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

// testing without data comment this next line out
app.get('/hello',sayHello);
function sayHello(request, response) {
  response.render('pages/index')
};


app.listen(PORT, () => console.log(`Listening on : ${PORT}`));

app.get('/', newSearch);

function newSearch(request, response) {
  response.render('pages/index')
};

'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.listen(PORT, () => console.log(`Listening on : ${PORT}`));

// Render Google Books API
app.get('/', newSearch)

// testing without data comment this next line out
app.post('/searches', createSearch);


// Error Function

app.get('*', (request, response) => response.status(404).send('Route does not work'));

// Making images Safe HTTPS
// function https = 


function newSearch(request, response) {
  response.render('pages/index')
};

function Book(info) {
  const placeholderImage = 'https://www.freeiconspng.com/img/139';
  if(info.imageLinks){
    this.cover = info.imageLinks.thumbnail;
    // console.log(this.cover);
    let regex = /^http:\/\//ig;
    if(this.cover.match(regex)){
      this.cover = this.cover.replace(/^http:\/\//i, 'https://');
      // console.log(this.cover);
    }
  }else {
    this.cover = placeholderImage;
  }
  this.title = info.title;
  this.authors = info.authors;
}

function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body);
  console.log(request.body.search);

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`;}
  if (request.body.search[1] === 'author') { url += `+inauthor: ${request.body.search[0]}`;}
  console.log(url);
  superagent.get(url) 
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('../views/pages/searches/show', { searchResults: results }));  
  }





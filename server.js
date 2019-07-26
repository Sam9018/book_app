'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
const pg = require('pg');
const methodOverride = require('method-override');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('err',err=>console.log(err));

app.use(express.urlencoded({ extended: true}));
app.use(express.static('./public'));
app.set('view engine', 'ejs');



// main page to search
app.get('/searches', newSearch);
//Render books from API
app.get('/',getBookshelf);
//detail page
app.get('/books/:id',getDetail)

// new routes
app.post('/searches', createSearch);
app.post('/books',saveBook);


// Error Function

app.get('*', (request, response) => response.status(404).send('Route does not work'));


//function to get books from sql
function getBookshelf(request,response){
  let SQL = 'SELECT * FROM books';
  return client.query(SQL)
    .then (results => response.render('../views/pages/index.ejs', {results: results.rows}))
    .catch(err=>console.log('cannot get data from database',err));
}


//get books from api function
function newSearch(request, response) {
  response.render('../views/pages/searches/new.ejs');
};

function Book(info) {
  this.authors = info.authors ? info.authors[0] : "no authors";
  this.title = info.title ? info.title : "no title";
  this.isbn = info.industryIdentifiers ? info.industryIdentifiers[0].identifier : "no isbn";
  const placeholderImage = 'https://www.freeiconspng.com/img/139';
  if(info.imageLinks){
    this.images_url = info.imageLinks.thumbnail;
    // console.log(this.images_url);
    let regex = /^http:\/\//ig;
    if(this.images_url.match(regex)){
      // Making images Safe HTTPS
      this.images_url = this.images_url.replace(/^http:\/\//i, 'https://');
      // console.log(this.images_url);
    }
  }else {
    this.images_url = placeholderImage;
  }
  this.description = info.description;
  this.bookshelf = '';
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
    .then(results => {
      console.log('api response map : ', results);
      response.render('../views/pages/searches/show', { results: results })
    })
    .catch(err=>console.log( err, 'something in createSearch went wrong'));
  }

//get the details from one book
function getDetail(request,response){
  let SQL = 'SELECT * FROM books WHERE id=$1';
  let values = [request.params.id];
  return client.query(SQL,values)
    .then(result =>{
      console.log('get detail response', result);
      return response.render('../views/pages/books/show',{item: result.rows[0]});
    })
    .catch(err=>console.log('get detail function is not working.',err));
}  

function saveBook(request,response){
  let {authors,title,isbn,images_url,description,bookshelf} = request.body;
  let SQL = `INSERT INTO books(authors, title, isbn, images_url, description, bookshelf)VALUES($1,$2,$3,$4,$5,$6)`;
  let values = [authors, title, isbn, images_url, description, bookshelf];
  return client.query(SQL,values)
    .then(()=>{
      SQL = `SELECT * FROM books WHERE isbn=$1`;
      values = [request.body.isbn];
      return client.query(SQL,values)
        .then(result=> {
          console.log('from db', result.rows[0]);
         return response.redirect(`/books/${result.rows[0].id}`)
        
        })
        .catch(err=>{console.log('something wrong with saveBook function')});
    })
}


app.listen(PORT, () => console.log(`Listening on : ${PORT}`));


DROP TABLE IF EXISTS books;

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    authors VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    images_url VARCHAR(255),
    description VARCHAR(255),
    bookshelf VARCHAR(255)
); 

INSERT INTO books (authors,title,isbn,images_url,description,bookshelf)
VALUES('J.R.R.Tolkien','The Hobbit','9780007322602','http://books.google.com/books/content?id=U799AY3yfqcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Read the definitive edition of Bilbo Baggins’ adventures in middle-earth in this classic bestseller behind this year’s biggest movie.','my favorite');
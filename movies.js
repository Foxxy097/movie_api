const express = require('express');
const app = express();

let users =[
  { id: 1,
    name:'Bob',
    favoritMovies:[]
  },

  { id: 2,
    name:'Sarah',
    favoritMovies:['Encanto']
  }

]

let movies = [
  { title: 'Encanto',
    genre: 'Musical, comedy',
    director:'Byron Howard, Jared Bush'},

  { title: 'Spider-Man: No Way Home ',
    genre: 'Action',
    director:'Jon Watts'},

  { title: 'Shang-Chi and the Legend of the Ten Rings',
    genre:'Action, fantasy',
    director:'Destin Daniel Cretton'},

  { title: 'Eternals',
    genre:'Action',
    director:'Kevin Feige, Nate Moore'},

  { title: 'Last Christmas',
    genre:'Romance, Comedy',
    director:'Paul Feig'},

  { title: 'Doctor Strange',
    genre:'Action',
    director:'Scott Derrickson'},

  { title: 'Doctor Strange 2',
    genre:'Action',
    director:'Sam Raimi'},

  { title: 'Grinch',
    genre:'fantasy',
    director:'Ron Howard'},

  { title: 'The Witches',
    genre:'Fantasy, comedy',
    director:'Robert Zemeckis'},

  { title: 'Jumanji',
    genre:'Fantasy',
    director:'Joe Johnston'}
];

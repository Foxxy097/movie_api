const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid')

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());

let users =[
  {
    id: 1,
    name: 'Bob',
    favoritMovies:[]
  },

  { id: 2,
    name:'Sarah',
    favoritMovies:['Encanto']
  }

];

let movies = [
  { Title: 'Encanto',
    Genre: { Name: 'Musical' },
    Director:{ Name: 'Byron Howard'},
  },
  { title: 'Spider-Man: No Way Home ',
    Genre: { Name:'Action'},
    Director:{ Name:'Jon Watts'}
  },

  { title: 'Shang-Chi and the Legend of the Ten Rings',
    Genre: { Name:'Action, fantasy'},
    Director:{ Name:'Destin Daniel Cretton'}
  },

  { title: 'Eternals',
    Genre: { Name:'Action'},
    Director:{ Name: 'Kevin Feige, Nate Moore'}
  },

  { title: 'Last Christmas',
    Genre: { Name:'Romance, Comedy'},
    Director:{ Name: 'Paul Feig'}
  },

  { title: 'Doctor Strange',
    Genre: { Name:'Action'},
    Director:{ Name: 'Scott Derrickson'}
  },

  { title: 'Doctor Strange 2',
    Genre: { Name:'Action'},
    Director:{ Name: 'Sam Raimi'}
  },

  { title: 'Grinch',
    Genre: { Name:'fantasy'},
    Director:{ Name: 'Ron Howard'}
  },

  { title: 'The Witches',
    Genre: { Name:'Fantasy, comedy'},
    Director:{ Name: 'Robert Zemeckis'}
  },

  { title: 'Jumanji',
    Genre: { Name:'Fantasy'},
    Director:{ Name: 'Joe Johnston'}
  }
];

const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser');
  uuid = require('uuid')

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let users =[
  { id: 1,
    name:'Bob',
    favoriteMovies:[]
  },

  { id: 2,
    name:'Sarah',
    favoriteMovies:['Encanto']
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

// CREATE
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('users need names')
  }

})

// UPDATE
app.put('/users/:id', (req, res) => {
  const{ id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no user found')
  }
})

//CREATE
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no user found')
  }
})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no user found')
  }
})

//DELETE
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id);
    res.status(200).send(`user ${id} has been deleted `);
  } else {
    res.status(400).send('no user found')
  }
})

//READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req, res) => {
  const title = req.params.title;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('The movie was not found')
  }
})

//READ
app.get('/movies/genre/:genreName', (req, res) => {
  const{ genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('The genre was not found')
  }
})

//READ
app.get('/movies/director/:directorName', (req, res) => {
  const{ directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('The director was not found')
  }
})



//app.get('/', (req, res) => {
//  res.send('My Top 10 Movies!');
//});

//app.get('/movies', (req, res) => {
//  res.json(top10Movies);
//});


app.use(express.static('public'));

app.get('/documentation', (req, res) => {
res.sendFile('public/documentation.html', { root:__dirname });
});







app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

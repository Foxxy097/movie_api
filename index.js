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


// CREATE
app.post('/users', (req, res) ==> {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    user.push(newUser);
    res.status(201).json(newUser):
  } else {
    res.status(400).send('users need names')
  }

})

// UPDATE
app.post('/users/:id', (req, res) ==> {
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
app.post('/users/:id/:movieTitle' (req, res) =>{
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
app.delete('/users/:id/:movieTitle' (req, res) =>{
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
app.delete('/users/:id' (req, res) =>{
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
app.get('/movies', (req, res) ==>{
  res.status(200).json(movies);
})

//READ
app.get('/movies/:title', (req, res) ==>{
  const{ title } = req.params;
  const movie = movies.find( movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('The movie was not found')
  }
})

//READ
app.get('/movies/genre/:genreName', (req, res) ==>{
  const{ genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('The genre was not found')
  }
})

//READ
app.get('/movies/directors/:directorName', (req, res) ==>{
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


//app.use(express.static('public'));

//app.get('/documentation', (req, res) => {
//  res.sendFile('public/documentation.html', { root:__dirname });
//});







app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

const mongoose = require('mongoose');
const Models = require ('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express');
  morgan = require('morgan');
  bodyParser = require('body-parser');
  uuid = require('uuid')

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

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
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

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

// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//CREATE
app.post('/users/:id/:movieTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/users/:id/:movieTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
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
//app.delete('/users/:id', (req, res) => {
//  const { id } = req.params;

//let user = users.find( user => user.id == id );

//  if (user) {
//    users = users.filter( user => user.id != id);
//    res.status(200).send(`user ${id} has been deleted `);
//  } else {
//    res.status(400).send('no user found')
//}
//})

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json(movies);
})

//READ
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  const title = req.params.title;
  const movie = movies.find( movie => movie.Title === title );

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('The movie was not found')
  }
})

//READ
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const{ genreName } = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName ).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('The genre was not found')
  }
})

//READ
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const{ directorName } = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('The director was not found')
  }
})

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

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

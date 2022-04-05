const express = require('express'), //express framework
      app = express(),      //express framework beeing used
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      morgan = require('morgan'),
      mongoose = require('mongoose'),
      Models = require('./models.js'),
      Movies = Models.Movie,  //model name in models.js
      Users = Models.User; //model name in models.js
      // all const are being written one after another and seprated by a colon to avoid re-writting "const" multiple times

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.MOVIEFLIX_URI, {useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('common'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const { check, validationResult } = require('express-validator'); //server-sided validation

const cors = require('cors');

app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');

require('./passport');

//CREATE Movie

app.post('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.body.Title })
    .then((movie) => {
      if (movie) {
        return res.status(400).send(req.body.Title + 'already exists');
      } else {
        Movies
          .create({
            Title: req.body.Title,
            Description: req.body.Description,
            Genre: req.body.Genre.Name,
            Director: req.body.Director.Name,
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

//CREATE User

app.post('/users',

[
   check('Username', 'Username is required').isLength({min: 5}),
   check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
   check('Password', 'Password is required').not().isEmpty(),
   check('Email', 'Email does not appear to be valid').isEmail()
 ], (req, res) => {

 // check the validation object for errors
   let errors = validationResult(req);

   if (!errors.isEmpty()) {
     return res.status(422).json({ errors: errors.array() });
   }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
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

//READ User List

// Get all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//READ Movie List

app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => { //req = request, res = response
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies); //status 201 when information is returned
  })
.catch((err) => {
    console.error(err);
    res.status(500).send("Error:" + err);
  });
});

//READ Movie Title

app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ Title: req.params.title}) // Find the movie by title
    .then((movie) => {
      if(movie){ // If movie was found, return json, else throw error
        res.status(200).json(movie);
      } else {
        res.status(400).send('Movie not found');
      };
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

//READ Movie Genre

app.get('/genre/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name}) // Find one movie with the genre by genre name
    .then((movie) => {
      if(movie){ // If a movie with the genre was found, return json of genre info, else throw error
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send('Genre not found');
      };
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

//READ Movie Director

app.get('/director/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name}) // Find one movie with the director by name
    .then((movie) => {
      if(movie){ // If a movie with the director was found, return json of director info, else throw error
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send('Director not found');
      };
    })
    .catch((err) => {
      res.status(500).send('Error: '+ err);
    });
});

//READ Main Page

app.get('/', (req, res) => {
  res.send('Welcome to my favorite movies list!');
});

//READ Documentation

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));    //static file given access via express static

//UPDATE User

app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday,
    },
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

//UPDATE User Favorite Movies

// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  {
     $push: { FavoriteMovies: req.params.MovieID }
   },
      { new : true }) // Return the updated document
       .then((updatedUser) => {
           res.json(updatedUser); // Return json object of updatedUser
       })
       .catch((err) => {
         console.error(err);
         res.status(500).send('Error: ' + err);
       });
   });

//DELETE User Favorite Movies

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
  {
     $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new : true }) // Return the updated document
   .then((updatedUser) => {
       res.json(updatedUser); // Return json object of updatedUser
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
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


//Error Handling in Express/Middleware. This code comes after all "app.use" and route calls ("app.get", "app.post") BUT before "app.listen"

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('WTF?!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

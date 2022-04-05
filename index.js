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

let auth = require('./auth');
auth(app);

const passport = require('passport');

require('./passport');


app.get('/',(req,res) => {
  res.send('Welcome to myMovies!');
});

//show list of all horror movie data
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(function (movies)  {
      res.status(201).json(movies);
    })
    .catch(function (err)  {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//show one movie's data by name
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.findOne( {Title: req.params.Title} )
    .then((movieTitle) => {
      res.status(201).json(movieTitle);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//show a subgenre and description
app.get('/movies/Genres/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.find({'Genre.Name': req.params.Name})
  .then((GenreName) => {
    res.status(201).json(GenreName)
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }) ;
});

//show a director's movies by name
app.get('/movies/Directors/:Name', passport.authenticate('jwt', { session: false }), (req,res) => {
  Movies.find({'Director.Name': req.params.Name})
    .then((Directors) => {
      res.status(201).json(Directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow new user to register
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Password', 'Password must be 8 characters long').isLength({min: 8}),
    check('email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) //search to see if User already exists
    .then((user) => {
      if(user) { //if use is found send below response
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            email: req.body.email,
            Birthdate: req.body.Birthdate
          })
          .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.log(error);
            res.status(500).send('Erorr:' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error:' + error);
    });
});

//Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req,res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error:' + err);
    });
});

//Allow user to update info by username
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
[
  check('Username', 'Username is required, minimum of 5 characters').isLength({min: 5}).optional(),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric().optional(),
  check('Password', 'Password is required').not().isEmpty().optional(),
  check('Password', 'Password must be 8 characters long').isLength({min: 8}).optional(),
  check('email', 'Email does not appear to be valid').isEmail().optional()
],
(req,res) => {
  // check validation result
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
  return res.status(422).json({errors: validationErrors.array()});
  }
    // hash the updated password
  const hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      email: req.body.email,
      Birthdate: req.body.Birthdate
    }
  },
  { new: true }, //this line ensures the updated document is returned to the user
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow user to add movie to list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req,res) => {
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

//Allow user to remove movie from list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // ensures that the updated document is returned
  (err, removeFavorite) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(removeFavorite);
    }
  });
});

//Allow user to delete user account
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req,res) => {
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



//get documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error has been detected')
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});

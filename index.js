const express = require('express');
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));


app.get('/', (req, res) => {
  res.send('My Top 10 Movies!');
});

app.get('/movies', (req, res) => {
  res.json(top10Movies);
});


app.use(express.static('public/documentation.html'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});

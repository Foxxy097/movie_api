## Server-side component of Movie App

### <b> Project Description </b>

The API for the "movies" web application interacts with a database that stores data about different movies. The web application provides users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies

## Project dependencies/ Tools

- NodeJS
- Express
- MongoDB

## Link to hosted version of App

- **[Click here](https://myflixapp1.herokuapp.com/)**


## Essential Features/ Technical Requirements

● API is build using Node.js and Express application

● API uses REST architecture, and following are the URL endpoints

| Request                                                    | URL                         | HTTP Method | Response                                                                           |
| ---------------------------------------------------------- | --------------------------- | ----------- | ---------------------------------------------------------------------------------- |
| Display Welcome message                                    | /                           | GET         | Returns Welcome message.                                                           |
| API Documentation                                          | /documentation              | GET         | Returns API documentation.                                                         |
| Get a list of movies                                       | /movies                     | GET         | Returns a JSON list of movies.                                                     |
| Get data about the movie                                   | /movies/:title              | GET         | Returns a JSON with data about a single movie by title to the user.                |
|                                                            |
| Return data about a genre by name/title.                   | /genres/:genre              | GET         | Returns a JSON data with movies of that genre.                                     |
|                                                            |
| Get data about director                                    | /directors/:directorName    | GET         | Return data about a director (bio, birth year, death year) by name.                |
|                                                            |
| Get list of all users                                      | /users                      | GET         | Returns a JSON data with all the users.                                            |
|                                                            |
| New user Registration                                      | /users                      | POST        | Allow new user to register entering his name, age and UUID assigned automatically. |
|                                                            |
| Allow users to update their user info (username)           | /users/:Username            | PUT         | Returns a text only confirming orginal userName has been changed.                  |
|                                                            |
| Allow users to add a movie to their list of favorites      | /users/:Username/movies/:id | POST        | Allow users to add a movie to their list of favorites.                             |
|                                                            |
| Allow users to remove a movie from their list of favorites | /users/:Username/movies/:id | DELETE      | Allow users to remove a movie from their list of favorites.                        |
|                                                            |
| Allow existing users to deregister                         | /users/:Username            | DELETE      | Allow existing users to deregister.                                                |
|                                                            |

● Database is built using MongoDB and uploaded to MongoDB Atlas <br />
● Database is connected to API deployed on Heroku<br />
● API includes user authentication, authorization code and data validation at relevant endpoints

/**
 * @file contains interactive data / data logic
 */
 const mongoose = require('mongoose');

 const bcryptjs = require('bcryptjs');
 
 let movieSchema = mongoose.Schema({
     Title: { type: String, required: true }, 
     Description: { type: String, required: true }, 
     Genre: {
         Name: String, 
         Description: String
     }, 
     Director: {
         Name: String, 
         Bio: String, 
         Birth: String, 
         Death: String
     },
         ImagePath: String,
         Featured: Boolean
 });
 
 let userSchema = mongoose.Schema({
     Username: {type: String, required: true},
     Birthday: Date,
     Password: {type: String, required: true},
     Email: {type: String, required: true},
     FavoriteMovie:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
 });
 
 userSchema.statics.hashPassword = (password) => {
     return bcryptjs.hashSync(password, 10);
   };
   
   userSchema.methods.validatePassword = function(password) {
     return bcryptjs.compareSync(password, this.Password);
   };
 
 const Movie = mongoose.model('Movie', movieSchema);
 const User = mongoose.model('User', userSchema);
 
 module.exports.Movie = Movie;
 module.exports.User = User;
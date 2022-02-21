const jwtSecret = 'your_jwt_secret';
// this has to be in the same key used in the SWTStrategy

const jwt = require ('jsonwebtoken'),
passport = require ('passport');

require('./passport');//your local passport file
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // this is the username you are encoding in the JWT
        expiresIn: '7d', // This specifies that the token will expire in 7 days
        algorithm: 'HS256' // This is the algorithm used to sign or encode
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('movies/login', (req, res) => {
        passport.authenticate('local', {session:false}, (error, user, info)=> {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token
                });
            });
        })(req, res);
    });
}

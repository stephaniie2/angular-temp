const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');

exports.auth = function(req, res) {
    const { email, password }= req.body;
    
    if (!password || !email) {
        res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password'}]});
    }

    User.findOne({email}, function(err, user) {
        if (err) {
            res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (!user) {
            res.status(422).send({errors: [{title: 'Invalid user', detail: 'User does not exist'}]});
        }

        if (user.hasSamePassword(password)) {

            // return JWT token
            const token = jwt.sign({
                userId: user.id,
                username: user.username
              }, config.SECRET, { expiresIn:'1h' });

              return res.json(token);
        } else {
            res.status(422).send({errors: [{title: 'Wrong data', detail: 'Wrong email or password'}]});
        }
    });
}

exports.register = function(req, res) {
    const { username, email, password, passwordConfirmation }= req.body;

    if (!password || !email) {
        res.status(422).send({errors: [{title: 'Data missing!', detail: 'Provide email and password'}]});
    }

    if (password != passwordConfirmation) {
        res.status(422).send({errors: [{title: 'Invalid password', detail: 'Password does not match'}]});
    }

    User.findOne({email}, function(err, existingUser) {
        if (err) {
            res.status(422).send({errors: normalizeErrors(err.errors)});
        }

        if (existingUser) {
            res.status(422).send({errors: [{title: 'Invalid email', detail: 'User already exists'}]});
        }

        const user = new User({
            username,
            email,
            password
        });
        user.save(function(err) {
            if (err) {
                res.status(422).send({errors: normalizeErrors(err.errors)});
            }

            res.json({'registered': true});
        });
    })
    res.json({username, email});
}

exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);

        User.findById(user.userId, function(err, user) {
            if (err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)});
            }

            if (user) {
                res.locals.user = user;
                next();
            } else {
                return notAuthorized(res);
            }
        });

    } else {
        return notAuthorized(res);
    }
}

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.SECRET);
}

function notAuthorized(res) {
    res.status(401).send({errors: [{title: 'Not authorized', detail: 'Required to login'}]});
}
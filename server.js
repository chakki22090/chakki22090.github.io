const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'code',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
        if (username === 'Jim' && password === 'password') {
            return done(null, { id: 'user_id', name: 'Jim' });
        } else {
            return done(null, false, { message: 'Incorrect login details.' });
        }
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    if (id === 'user_id') {
        done(null, { id: 'user_id', name: 'Jim' });
    } else {
        done(new Error('User not found'));
    }
});

app.get('/slogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/blog.html'));
});
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/services.html'));
});
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/about.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});



app.post('/slogin', 
    passport.authenticate('local', { failureRedirect: '/slogin' }),
    function(req, res) {
        req.session.editMode = true; 
        res.redirect('/blog.html'); 
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    req.session.editMode = false;
    res.redirect('/');
});

app.get('/blog', (req, res) => {
    if (req.session.editMode) {
        // показать блог в режиме редактирования
    } else {
        // показать обычный блог
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/.`);
});

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path'); // Добавь эту строку

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
        if (username === 'login' && password === 'password') {
            return done(null, { id: 'user_id', name: 'Charlie' });
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
        done(null, { id: 'user_id', name: 'Charlie' });
    } else {
        done(new Error('User not found'));
    }
});

// Используй этот код для страницы входа
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/LoginPage.html'));
});

app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    }
);

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/.`);
});

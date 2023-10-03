const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'code',
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

const MONGODB_URI = process.env.MONGO_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch(error => {
        console.log("error:", error.message);
    });
    app.get('/blog', async (req, res) => {
        try {
            const posts = await Post.find();  // Извлекаем все посты из MongoDB
            // Далее тебе нужно будет передать эти посты на фронтенд и отобразить их там
            res.sendFile(path.join(__dirname, 'public/blog.html'));
        } catch (error) {
            console.error("Ошибка при получении постов:", error);
            res.status(500).send('Ошибка сервера');
        }
    });
    

// Хранение блог-постов
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,
    category: String
});

const Post = mongoose.model('Post', postSchema);

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

app.post('/api/addpost', async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            category: req.body.category
        });
        await newPost.save();
        res.json({ success: true, message: 'Пост успешно добавлен!' });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json({ success: true, posts });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

app.get('/blog', async (req, res) => {
    try {
        const posts = await Post.find();  // Извлекаем все посты из MongoDB
        res.render('blog', { posts: posts });  // Передаем посты в шаблон страницы блога
    } catch (error) {
        console.error("Ошибка при получении постов:", error);
        res.status(500).send('Ошибка сервера');
    }
    res.sendFile(path.join(__dirname, 'public/blog.html'));

});

app.get('/slogin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
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

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
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

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
    _id: mongoose.Schema.Types.ObjectId,
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
app.post('/api/addpost', upload.single('postImage'), async (req, res) => {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("Attempting to add a post with data:", req.body);
    try {
        const newPost = new Post({
            _id: new mongoose.Types.ObjectId(),
            title: req.body.title,
            content: req.body.content,
            image: imageUrl,
            category: req.body.category
        });
        await newPost.save();
        res.json({ success: true, message: 'Пост успешно добавлен!' });
    } catch (err) {
        console.error("Error while adding post:", err);
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




app.delete('/api/deletepost/:postId', async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.postId });
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



app.get('/blog', async (req, res) => {
    try {
        const posts = await Post.find(); 
        // Ты здесь можешь передать в функцию render свои посты, чтобы отобразить их в HTML
        if (req.session.editMode) {
            // Показать блог в режиме редактирования
            res.render('blog_edit', { posts: posts }); 
        } else {
            // Показать обычный блог
            res.render('blog', { posts: posts });  
        }
    } catch (error) {
        console.error("Ошибка при получении постов:", error);
        res.status(500).send('Ошибка сервера');
    }
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


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/.`);
});

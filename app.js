const express = require('express');
const morgan = require('morgan');
const cookieParse = require('cookie-parser');
require('dotenv').config();
const db_mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();

// Set Port
app.set('port', (process.env.PORT || 3000));

// connect to mongodb
const usernames = process.env.USERNAMES;
const password = process.env.PASSWORD;
const db = `mongodb+srv://${usernames}:${password}@blognodejs.ymwfinh.mongodb.net/blog-nodejs?retryWrites=true&w=majority`;
db_mongoose.connect(db)
    .then(() => app.listen(app.get('port'), function() {
        console.log('Connected to db');
        console.log('Server started on port '+app.get('port'));
    }))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParse());

// static files
app.use(express.static('public'));

// mongoose and mongo sandbox routes
app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('commons/home', { title: 'Home' });
});

app.get('/about', requireAuth, (req, res) => {
    res.render('blogs/about.ejs', { title: 'About' });
});

// redirects
app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

// blog routes
app.use('/blogs', blogRoutes);

// auth routes
app.use('/auth', authRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).render('commons/404', { title: '404' });
});

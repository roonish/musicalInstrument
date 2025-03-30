var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Veritabanı adını proje adına uygun yapalım
mongoose.connect('mongodb://127.0.0.1:27017/Instruments', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

const db = mongoose.connection;
db.once('open', function () {
    console.log('MongoDB connected');
});

// Import Controller
const authController = require('./controllers/authController.js');

// Authentication Routes
app.get('/signup', authController.getSignupPage);
app.post('/signup', authController.signup);
app.get('/login', authController.getLoginPage);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Dashboard Route (Check if user is logged in using a simple variable)
app.get('/dashboard', (req, res) => {
    if (!global.currentUser) {
        return res.redirect('/login');
    }
    res.render('dashboard', { title: 'Admin Dashboard', user: global.currentUser });
});

// category page
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/categories', categoryRoutes);

//product page
const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

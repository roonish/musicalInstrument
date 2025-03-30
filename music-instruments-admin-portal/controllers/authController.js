const User = require('../models/usermodel');

// Function to check if an email is valid
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to check if username is valid
const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
};

// Function to check if password is valid
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:<>?]).{8,}$/;
    return passwordRegex.test(password);
};

exports.getSignupPage = (req, res) => {
    res.render('auth/signup', { 
        title: 'Sign Up', 
        error: null,
        success: null,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
};

exports.signup = async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;

        // Check if any field is empty
        if (!username || !firstName || !lastName || !email || !password) {
            return res.render('auth/signup', { 
                title: 'Sign Up', 
                error: 'All fields are required!',
                success: null,  // Ensure success is always passed
                username,
                firstName,
                lastName,
                email,
                password
            });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.render('auth/signup', { 
                title: 'Sign Up', 
                error: 'Invalid email format!',
                success: null,  // Ensure success is always passed
                username,
                firstName,
                lastName,
                email,
                password
            });
        }

        // Validate username (only letters and numbers)
        if (!validateUsername(username)) {
            return res.render('auth/signup', { 
                title: 'Sign Up', 
                error: 'Username can only contain letters and numbers!',
                success: null,  // Ensure success is always passed
                username,
                firstName,
                lastName,
                email,
                password
            });
        }

        // Check if email already exists
        if (await User.findOne({ email })) {
            return res.render('auth/signup', { 
                title: 'Sign Up', 
                error: 'Email is already in use!',
                success: null,  // Ensure success is always passed
                username,
                firstName,
                lastName,
                email,
                password
            });
        }

        // Check if username already exists
        if (await User.findOne({ username })) {
            return res.render('auth/signup', { 
                title: 'Sign Up', 
                error: 'Username is already taken!',
                success: null,  // Ensure success is always passed
                username,
                firstName,
                lastName,
                email,
                password
            });
        }

        // Save user with plain text password (Not Secure)
        const newUser = new User({ username, firstName, lastName, email, password });

        await newUser.save();

        // Redirect to login page with success message
        res.redirect('/login?success=Sign up successful! You can now log in.');
        
    } catch (error) {
        res.status(500).render('auth/signup', { 
            title: 'Sign Up', 
            error: 'Error signing up, please try again!',
            success: null,  // Ensure success is always passed
            username,
            firstName,
            lastName,
            email,
            password
        });
    }
};



exports.getLoginPage = (req, res) => {
    const successMessage = req.query.success || null;  // Capture success message if available
    res.render('auth/login', { 
        title: 'Login', 
        error: null,
        success: successMessage, // Pass success to the view
        username: '',  // Default empty value
        email: ''       // Default empty value
    });
};


exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if fields are empty
        if ((!username && !email) || !password) {
            return res.render('auth/login', { 
                title: 'Login', 
                error: 'All fields are required!',
                success: null,  // Ensure success is passed as null in case of error
                username: username || '',  // Preserve the username entered
                email: email || ''         // Preserve the email entered
            });
        }

        // Validate email format if user enters an email instead of a username
        if (email && !validateEmail(email)) {
            return res.render('auth/login', { 
                title: 'Login', 
                error: 'Invalid email format!',
                success: null, // Ensure success is passed as null in case of error
                username: username || '', 
                email: email || ''
            });
        }

        // Determine whether to search by email or username
        let user;
        if (email) {
            // If email is provided, search by email
            user = await User.findOne({ email });
        } else if (username) {
            // If username is provided, search by username
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.render('auth/login', { 
                title: 'Login', 
                error: 'User not found!',
                success: null,  // Ensure success is passed as null in case of error
                username: username || '', 
                email: email || ''
            });
        }

        // Check if password matches (Plain Text Comparison)
        if (password !== user.password) {
            return res.render('auth/login', { 
                title: 'Login', 
                error: 'Invalid password!',
                success: null,  // Ensure success is passed as null in case of error
                username: username || '', 
                email: email || ''
            });
        }

        // Store user as logged in (if using sessions, replace this with session logic)
        global.currentUser = user;
        // On successful login, pass success message to the view
        res.redirect('/dashboard?success=Login successful!');
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).render('auth/login', { 
            title: 'Login', 
            error: 'Error logging in, please try again!',
            success: null,  // Ensure success is passed as null in case of error
            username: username || '', 
            email: email || ''
        });
    }
};


exports.logout = (req, res) => {
    global.currentUser = null;
    res.redirect('/login');
};

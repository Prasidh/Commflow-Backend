const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
// const OAuth = require('oauth').OAuth;
const nodemailer = require("nodemailer");
const {format, addMinutes} = require('date-fns');
const {zonedTimeToUtc} = require('date-fns-tz');


exports.signup = async (req, res) => {
    try {
        const {username, fullname, email,password, Admin, role} = req.body;
        // Check if the username already exists
        const existingUsername = await User.findOne({username});
        if (existingUsername) {
            return res.status(400).json({error: 'Username already exists'});
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({error: 'Email already exists'});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            fullname,
            email,
            password: hashedPassword,
            Admin: Admin || false,
            role,
        });

        await user.save();
        res.status(201).json({message: 'User created successfully', user});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error', error});
    }
};

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if the email exists
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({error: 'Invalid email'});
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(passwordMatch);
            return res.status(401).json({error: 'Invalid password'});
        }


        const userData = {
            _id: user._id,
            role: user.role,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            isAccountConnected: user.isAccountConnected,
            Admin: user.Admin,
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.userByEmail = async (req, res) => {
    try {
        const {email} = req.body;

        // Check if the email exists
        const user = await User.findOne({email})
        .select('-requestToken -requestTokenSecret');
        if (!user) {
            return res.status(401).json({error: 'Invalid email'});
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};


exports.requestPasswordReset = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            console.log(email);
            return res.status(404).json({error: 'User not found'});
        }

        const resetToken = generateResetToken();
        const currentTime = new Date(); // Get the current time
        const timeZone = 'Asia/Karachi'; // Replace with the user's timezone
        const resetTokenExpiry = addMinutes(currentTime, 5); // Token expires in 5 minutes
        const resetTokenExpiryUTC = zonedTimeToUtc(resetTokenExpiry, timeZone);
        const formattedResetTokenExpiry = format(resetTokenExpiryUTC, 'yyyy-MM-dd HH:mm:ss', {timeZone});
        console.log('Reset Token Expiry:', formattedResetTokenExpiry);
        console.log('Generated Reset Password:', resetToken);
        // console.log(resetTokenExpiry);

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiryUTC;
        await user.save();

        const resetLink = `http://yourapp.com/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hassanmemon1087@gmail.com', // Replace with your Gmail email
                pass: 'tzpjakzcfgmgfrnq', // Replace with your Gmail password
            },
        });
        const mailOptions = {
            from: 'mhassansohail2001@gmail.com',
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.status(500).json({error: 'Error sending email'});
            } else {
                console.log('Reset link sent:', info.response);
                res.status(200).json({message: 'Password reset link sent'});
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const {token, password} = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: {$gt: new Date()},
        });

        console.log('Received Token:', token);
        // console.log('User:', user); // Log the user object to see if it's retrieved correctly


        if (!user) {
            return res.status(400).json({error: 'Invalid or expired token'});
        }
        const timeZone = 'Asia/Karachi'; // Replace with the user's timezone
        const currentTimeUTC = new Date();
        console.log('Current Time (UTC):', currentTimeUTC);

        const currentTimeZoned = zonedTimeToUtc(currentTimeUTC, timeZone);
        console.log('Current Time (Zoned):', currentTimeZoned);
        console.log('Time Zone:', timeZone); // Log the timezone


        // Check if the token expiry is in the future in the user's timezone
        if (user.resetTokenExpiry.getTime() <= currentTimeZoned.getTime()) {
            return res.status(400).json({error: 'Invalid or expired token'});
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({message: 'Password reset successful'});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};


exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {username, fullname, email, password, role} = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        user.username = username || user.username;
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;

        }

        user.role = role || user.role;

        await user.save();

        res.status(200).json({massage: 'User information updated successfully', user});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})

    }
};



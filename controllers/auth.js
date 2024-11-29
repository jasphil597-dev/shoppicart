import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

import User from '../models/user.js';
// import validator from 'validator';

router.get('/sign-up', (req, res) => {
	res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
	res.render('auth/sign-in.ejs');
});

router.get('sign-out', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
	try {
		const userInDatabase = await User.findOne({ username: req.body.username });
		if (userInDatabase) {
			return res.send('Username already taken.');
		}
		//  Check if Passwords match
		if (req.body.password !== req.body.confirmPassword) {
			return res.send('Password and Confirm Password must match');
		}

		//  Hash the password before saving to DB
		const hashedPassword = bcrypt.hashSync(req.body.password, 5);
		req.body.password = hashedPassword;

		await User.create(req.body);

		res.redirect('/auth/sign-in');
	} catch (error) {
		console.error(error);
		res.redirect('/');
	}
});

router.post('/sign-in', async (req, res) => {
	try {
		const userInDatabase = await User.findOne({ username: req.body.username });
		if (!userInDatabase) {
			return res.send('Login failed. Please try again.');
		}
		const validPassword = bcrypt.compareSync(
			req.body.password,
			userInDatabase.password
		);

		if (!validPassword) {
			return res.send('Login failed. Please try again.');
		}
		req.session.user = {
			username: userInDatabase.username,
			_id: userInDatabase._id,
		};

		res.redirect('/');
	} catch (error) {
		console.error(error);
		return res.send('Login failed. Please try again.');
	}
});

export default router;

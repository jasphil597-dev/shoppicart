import express from 'express';
const router = express.Router();

import User from '../models/user.js';

const addToCart = async (req, res) => {
	const { userId, productId, quantity } = req.body;
	try {
		const product = await Product.findById(productId);
		let cart = await Cart.findOne({ user: userId, status: 'active' });

		if (!cart) {
			cart = new Cart({
				user: userId,
				items: [],
				totalPrice: 0,
			});
		}
		await cart.save();
		return res.send('/');
	} catch (error) {
		console.error('error');
	}
};

router.get('/', async (req, res) => {
	try {
		const user = await User.findById(req.session.user._id);
		res.render('grocery/index.ejs', {
			froceries: user.groceries,
		});
	} catch (error) {
		console.error(error);
		res.redirect('/');
	}
});

router.get('/grocery', (req, res) => {
	res.render('grocery/index');
});

router.get('/new', (req, res) => {
	res.render('grocery/new.ejs');
});

router.get('/grocery-list/:id', (req, res) => {
	const groceryId = req.params.id;
	try {
		if (!grocery) {
			res.render('grocery/show-grocery', { grocery });
		}
	} catch (error) {
		console.error(error);
		res.redirect('/');
	}
});

router.get('/new', (req, res) => {
	res.render('cartControllers/new.ejs');
});

router.post('/', async (req, res) => {
	try {
		const user = await User.findById(req.session._id);
		user.cartControllers.push(req.body);
		await user.save();

		res.redirect(`/users/${user._id}/cartControllers`);
	} catch (error) {
		console.error(error);
		res.send('There was an error creating the form');
	}
});

router.post('/signup', async (req, res) => {
	try {
		const { username, password } = req.body;

		const newUser = new User({ username, password });
		await newUser.save();

		req.session.user = newUser;
		res.redirect(`/users/${newUser._id}`);
	} catch (error) {
		console.error(error);
		res.send('Sign-up failed.');
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

		res.redirect('/groceryControllers/index.ejs');
	} catch (error) {
		console.error(error);
		res.redirect('/');
	}
});

// router.put('/:groceryId', async (req, res) => {
// 	try {
// 		const user = await User.findById(req.session.user._id);
// 		const grocery = user.groceries.id(req.params.groceryId);
// 		grocery.set(req.body);
// 		await user.save();

// 		res.redirect(`/users/${user._id}/groceries/${req.params.groceryId}`);
// 	} catch (error) {
// 		console.error(error);
// 		res.send('there was an error updating the grocery item');
// 	}
// });

// const userSchema = new mongoose.Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// });

// router.delete('/:groceryId', async (req, res) => {
// 	try {
// 		const user = await User.findById(req.session.user._id);
// 		user.groceries.id(req.params.groceryId).deleteOne();
// 		await user.save();

// 		res.redirect(`/users/${user._id}/groceriies`);
// 	} catch (error) {
// 		console.error(error);
// 		res.send('There wa an error deleting the grocery item');
// 	}
// });

// router.get('/', async (req, res) => {
// 	try {
// 		const user = await User.findById(req.session.user._id);

// 		res.render('cartControllers/index.ejs', {
// 			cartControllers: user.cartControllers,
// 		});
// 	} catch (error) {
// 		console.error(error);
// 	}
// });

router.post('/add', addToCart);

export default router;

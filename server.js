import express from 'express';
import './db/connection.js';
import methodOverride from 'method-override';
import morgan from 'morgan';
import session from 'express-session';
import authController from './controllers/auth.js';
import cartController from './controllers/cartControllers.js';
import passUserToview from './middleware/passUserToView.js';
import isSignedIn from './middleware/isSignedIn.js';
import MongoStore from 'connect-mongo';

const app = express();
const port = process.env.PORT ? process.env.PORT : '3001';

//	Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

//	Session management
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		// store: MongoStore.create({
		// 	mongoUrl: process.env.MONGO_URI,
		// }),
	})
);
app.use(passUserToview);

app.get('/', (req, res) => {
	res.render('index.ejs', {
		user: req.session.user,
	});
});

app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/cart', cartController);

app.listen(port, () => {
	console.log(`The express app is ready on port ${port}!`);
});

// import validator from 'validator';

// app.use(express.static(path.join('./public')));

// app.get('/', (req, res) => {
// 	res.send('Hello, World!');
// });

// app.get('/', async (req, res) => {
// 	const users = await User.find();
// 	res.render(users);
// });

// app.post('/products', async (req, res) => {
// 	const product = new Product(req.body);
// 	try {
// 		await product.save();
// 		res.send(product);
// 	} catch (error) {
// 		console.error(Error);
// 		res.send(error);
// 	}
// });

// app.post('/cart', async (req, res) => {
// 	const cart = new Cart(req.body);
// 	try {
// 		await cart.save();
// 		res.status(201).send(cart);
// 	} catch (error) {
// 		console.error(error);
// 		res.status(400).send(error);
// 	}
// });

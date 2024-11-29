import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
// import morgan from 'morgan';
// import session from 'express-session';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

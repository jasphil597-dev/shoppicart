import mongoose from 'mongoose';

const groceryItemSchema = new mongoose.Schema({
	name: String,
	price: Number,
	quantity: Number,
});

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	groceries: [groceryItemSchema],
});

const User = mongoose.model('User', userSchema);

export default User;

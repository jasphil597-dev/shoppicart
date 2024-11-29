//ChatGPT

import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			min: [1, 'Quantity must be at least 1'],
		},
		price: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
			default: function () {
				return this.quantity * this.price;
			},
		},
	},
	{ _id: false }
);

const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	items: [cartItemSchema],
	totalPrice: {
		type: Number,
		required: true,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ['active', 'ordered', 'cancelled'],
		default: 'active',
	},
});

cartSchema.pre('save', function (next) {
	this.totalPrice = this.items.reduce((total, item) => total + item.total, 0);
	next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;

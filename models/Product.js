const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['lighters', 'accessories', 'gadgets'],
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    images: {
        type: [String],
        default: []
    },
    video: {
        type: String,
        default: 'flames.mp4'
    },
    emoji: {
        type: String,
        default: '🔥'
    },
    stock: {
        type: Number,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

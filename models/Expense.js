const mongoose = require('mongoose');

// Expense Schema
const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',
    required: true,
  },
}, { timestamps: true });  


const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;

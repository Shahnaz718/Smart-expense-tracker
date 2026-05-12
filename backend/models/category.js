const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex code'],
    },
    icon: {
      type: String,
      default: '💰',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);

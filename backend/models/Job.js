const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
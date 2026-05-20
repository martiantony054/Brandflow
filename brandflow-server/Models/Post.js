
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    content:  { type: String, required: true },
    hashtags: { type: [String], default: [] },
    platform: {
      type:     String,
      enum:     ['instagram', 'twitter', 'linkedin', 'facebook'],
      required: true,
    },
    tone:     { type: String, default: 'Professional' },
    angle:    { type: String, default: '' },
    bestTime: { type: String, default: '' },

    source: {
      type:    String,
      enum:    ['generated', 'repurposed'],
      default: 'generated',
    },
    sourcePlatform: { type: String, default: null },

    prediction: {
      overall:     { type: Number, default: null },
      hook:        { type: Number, default: null },
      timing:      { type: Number, default: null },
      hashtags:    { type: Number, default: null },
      readability: { type: Number, default: null },
      verdict:     { type: String, default: '' },
      tips:        { type: [String], default: [] },
      scoredAt:    { type: Date,   default: null },
    },
  },
  { timestamps: true }
);

PostSchema.index({ platform: 1, createdAt: -1 });
PostSchema.index({ 'prediction.overall': -1 });

module.exports = mongoose.models.posting || mongoose.model('posting', PostSchema);
var mongoose = require('mongoose');
var handleDuplicateKeyError = require('../../helpers/handleDuplicateKeyError');
var Schema = mongoose.Schema;
var Report;

const ReportSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now, },
  updated: { type: Date },
  user: {
    type: Schema.Types.String,
    ref: 'User',
    justOne: true,
    required: [true, 'An user reference is required!'], },
  startDate: {
    type: Date,
    required: [true, 'A start date is required!'], },
  summary: { type: String },
  optimization: { type: String },
  recommendation: { type: String },
});

ReportSchema.post('save', handleDuplicateKeyError);
ReportSchema.post('update', handleDuplicateKeyError);
ReportSchema.post('findOneAndUpdate', handleDuplicateKeyError);

Report = mongoose.model('Report', ReportSchema);
module.exports = Report;

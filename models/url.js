var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);

var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  short_url: String,
  created_at: Date,
  last_usage: Date,
  usage_count: Number
});

urlSchema.pre('save', function(next){
  var doc = this;
  counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1}}, { "upsert": true, "new": true }, function(error, counter) {
      if (error)
          return next(error);
      doc.created_at = new Date();
      doc.last_usage = new Date();
      doc.usage_count = 1;
      doc._id = counter.seq;
      next();
  });
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a user']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true }
  }
);

//In order, to allow only one review from one user for a tour we use compound indexes and an option of unique set to true
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo'
  //   });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

//Static Functions
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //console.log(tourId);
  //this points to the current model
  //Note: We need to call aggregate pipeline directly on model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  //console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

//Calculating Stats, when a new review is created
reviewSchema.post('save', function () {
  //this points to the document that is being saved
  //Here, this refers to current review document
  //constructor is the model, which created the document

  this.constructor.calcAverageRatings(this.tour);
});

//Calculating Stats, when a review is updated or deleted
//Which is done using findByIdAndUpdate and findByIdAndDelete => /^findOneAnd/
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); //We have access to the review only when it is executed so we use findOne()
  //We use this here to pass the data from pre middleware to post middleware
  //console.log(this.r); //If we use pre middleware, the changes are not yet persisted to database, so we cannot calculate stats, and we cannot use post middleware because the query will already be executed and we don't have access to the review
  next();
});

//So in order to calculate stats we use this technique on post middleware
reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does not work here, because query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tour); //Now we have access to data from pre middleware
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

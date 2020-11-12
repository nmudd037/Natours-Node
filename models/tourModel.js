const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');
//const User = require('./userModel'); //Embedding

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], //validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less than or equal to 40 characters'],
      minlength: [10, 'A tour must have greater than or equal to 10 characters']
      //validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be Above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10 //Normally Math.round rounds to integer so 4.6667 => 5, so we use the trick to 4.6667 * 10 => 46.6667 => 47 / 10 => 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this keyword only points to current doc on NEW document creation
          return val < this.price; //100 < 200
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String], //array of strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date], //array of dates
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      // MongoDB uses special data format called GeoJSON, in order to specify geospatial data
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number], //expect an array of numbers
      address: String,
      description: String
    },
    locations: [
      //arr of GeoJSON objects - Embedded document inside the parent document
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    //guides: Array //Embedding
    //Modelling Tour Guides: Child Referencing
    guides: [
      //Reference to the user data model without saving the guides in the tour data model
      //Child referencing
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    //passing options, getting the virual properties to the document/object
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Creating Indexes
//tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 }); // 1 for Ascending Order and -1 for Descending Order
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//Mongoose Virtuals
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //the tour field in the Review model
  localField: '_id' //_id of the tour in the Tour model
  //look for the _id of the tour in the tour field in review
});

//Mongoose middleware
//Document middleware
//DOCUMENT MIDDLEWARE: Runs before .save() and .create()
tourSchema.pre('save', function (next) {
  //console.log(this);  //this is currently processed document
  //this function will be called before document saved to the DB
  //runs before .save() and .create() || .insertMany() will not trigger the function
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document!!!');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Document Middleware
//Modelling Tour Guides: Embedding
//Embedded users data model into tours data model
// tourSchema.pre('save', async function (next) {
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);
//   next();
// });

//Query Middleware
//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); //this keyword points to cuurent processing query
  this.start = Date.now();
  next();
});

//Populating Tour Guides for Referencing
tourSchema.pre(/^find/, function (next) {
  //using for populate all the query -> using reference
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   console.log(docs);
//   next();
// });

//Aggregation Middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

//Model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

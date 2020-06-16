const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      /** 
        required: true -> With Error Message
        trim -> for trimming any whitespace (beginning and end)
        unique -> No two bootcamps will have the same name
    */
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      unique: true,
    },
    /*
    if the name is Devcentral Bootcamp
    the slug will be devcentral-bootcamp 
  */
    slug: String,
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [500, "Description can not be more than 500 characters"],
    },
    website: {
      /** 
        match: -> means it should match the specified pattern 
        here in this case it is a regular expression 
        so the value of the website field should match this pattern

        Note
        - match will take regular expression as the first argument 
        this regular expression must be between / / 
    */
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        "Please use a valid URL with HTTP or HTTPS",
      ],
    },
    phone: {
      type: String,
      maxlength: [20, "Phone Number can not be longer  than 20 characters"],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    address: {
      type: String,
      required: [true, "Plase add an address"],
    },
    location: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ["Point"], // 'location.type' must be 'Point'
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      /** 
        enum -> means  that the only availble values are these values
    */
      // Array of strings
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create slug from name middleware
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Node-GeoCoder
BootcampSchema.pre("save", async function (next) {
  console.log(this.address);
  // Using async await

  const loc = await geocoder.geocode(this.address);
  console.log(loc[0]);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
  };

  this.address = undefined;
  next();
});

//Cascade delete courses when delete bootcamp
BootcampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

//Reverse Population with Courses
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);

const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please add a course description"],
  },
  weeks: {
    type: String,
    required: [true, "Please add course number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add course tuition"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add minimal skill required"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

/*
    Static VS Methods

    Static -> You can call it directly on the model like this
              Course.getAverage()
    Methods -> You can call it on what you get from the model as a result (basically on the query)
              const courses = Course.find()
              courses.getAverage()
*/

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  //   console.log("Calculating Average Cost...".blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (error) {
    console.log(error);
  }
  //   console.log(obj);
};

//Call getAverageCost after save new course
CourseSchema.post("save", async function () {
  //   console.log("Save");
  //   console.log(this.bootcamp);
  //   console.log(this);
  await this.constructor.getAverageCost(this.bootcamp);
});

//Call getAverageCost before remove a course
CourseSchema.post("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);

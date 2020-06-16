const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Courses = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @acess   Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find()
      .populate({
        path: "bootcamp",
        select: "name description",
      })
      .exec();
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get single Course
// @route   GET /api/v1/courses/:id
// @acess   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with Id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Create Course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @acess   Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  //   console.log(req.body);
  //   console.log(req.params.bootcampId);
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Bootcamp not found with Id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  let courseInRequest = req.body;
  courseInRequest.bootcamp = req.params.bootcampId;
  const course = await Courses.create(courseInRequest);
  res.status(200).json({ success: true, data: course });
});

// @desc    Update Course
// @route   PUT /api/v1/courses/:id
// @acess   Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Courses.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with Id of ${req.params.id}`, 404)
    );
  }

  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({ success: true, data: course });
});

// @desc    Delete Course
// @route   DELETE /api/v1/courses/:id
// @acess   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`Course not found with Id of ${req.params.id}`, 404)
    );
  }

  course.remove();
  res.status(200).json({ success: true, data: [] });
});

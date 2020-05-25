const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Get single Bootcamp
// @route   GET /api/v1/bootcamps/:id
// @acess   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
  // } catch (error) {
  //   // next(
  //   //   new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
  //   // );
  //   next(error);
  // }
});

// @desc    Create Bootcamp
// @route   POST /api/v1/bootcamps
// @acess   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  //console.log(req.body);
  // try {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(200).json({ success: true, data: bootcamp });
  // } catch (error) {
  //   next(error);
  // }
});

// @desc    Update Bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acess   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
  // } catch (error) {
  //   next(error);
  // }
});

// @desc    Delete Bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acess   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
  // } catch (error) {
  //   next(error);
  // }
});

// @desc    Delete Bootcamps
// @route   DELETE /api/v1/bootcamps
// @acess   Private
exports.deleteBootcamps = asyncHandler(async (req, res, next) => {
  // try {
  const bootcamp = await Bootcamp.deleteMany();

  res.status(200).json({ success: true, data: {} });
  // } catch (error) {
  //   next(error);
  // }
});

// @desc    Get Bootcamps Within Radius
// @route   GET /api/v1/bootcamps/radius/:city/:distance
// @acess   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { city, distance } = req.params;
  // console.log(city);
  // console.log(distance);

  //Get lng/lat
  const loc = await geocoder.geocode(city);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // console.log(loc);

  //Get the radius
  const radius = distance / 6371;
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

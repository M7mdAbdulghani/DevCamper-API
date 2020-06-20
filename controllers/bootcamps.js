const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all Bootcamps
// @route   GET /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();
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

// @desc    Upload Photo for Bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @acess   Private
exports.bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with Id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Photo was not found`, 400));
  }

  const file = req.files.file;

  //Make sure that the file uploaded is image
  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(`Plaese make sure that the file is an image`, 400)
    );
  }

  //Make sure that the file size is less than 1 MByte
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Plaese upload an image that is less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //Create Custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with uploading the photo`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

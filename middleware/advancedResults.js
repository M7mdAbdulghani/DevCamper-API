const advancedResults = (model, populate) => async (req, res, next) => {
  let reqQuery = { ...req.query };

  if ("select" in reqQuery) {
    delete reqQuery["select"];
  }
  if ("sort" in reqQuery) {
    delete reqQuery["sort"];
  }
  if ("limit" in reqQuery) {
    delete reqQuery["limit"];
  }
  if ("page" in reqQuery) {
    delete reqQuery["page"];
  }

  //Filtering
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)/g, (match) => {
    return `$${match}`;
  });

  console.log(queryStr);
  console.log(JSON.parse(queryStr));
  let query = model.find(JSON.parse(queryStr));

  //Selection
  if (req.query.select) {
    const attributes = req.query.select.toString().replace(/,/g, " ");
    console.log(attributes);
    query = query.select(attributes);
  }

  //Sorting
  if (req.query.sort) {
    const attributes = req.query.sort.toString().replace(/,/g, " ");
    query = query.sort(attributes);
  } else {
    query = query.sort("averageCost");
  }

  //Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1;
  const skip = (page - 1) * limit;
  const total = await model.countDocuments();
  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  //Executing Query
  const results = await query;

  //Pagination Result
  let pagination = {};

  if (page * limit > total) {
    pagination = {};
  } else if (page === 1) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  } else if (page * limit === total) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  } else {
    pagination.next = {
      page: page + 1,
      limit,
    };
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;

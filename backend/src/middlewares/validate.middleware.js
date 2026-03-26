const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return next({
      statusCode: 400,
      message: 'Validation failed',
      details: result.error.flatten()
    });
  }

  req.body = result.data;
  return next();
};

export default validate;

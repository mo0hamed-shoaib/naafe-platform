// Not found middleware
export const notFound = (req, res, next) => {
  const error = new Error(`المسار غير موجود - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const instructorOnly = (req, res, next) => {
  if (req.user?.role !== "instructor") {
    return res.status(403).json({ message: "Only instructors can do this" });
  }

  next();
};
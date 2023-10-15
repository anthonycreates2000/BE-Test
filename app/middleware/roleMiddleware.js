const checkUserRole = (requiredRole) => {
    return (req, res, next) => {
      const { user } = req;

      if (user && user.role === requiredRole) {
        next();
      } else {
        return res
          .status(403)
          .json({
            message:
              "You do not have the required role to access this endpoint.",
          });
      }
    };
}

module.exports = checkUserRole
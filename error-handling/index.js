module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).render("not-found");
  });

  app.use((error, req, res, next) => {
    // whenever you call next(error), this middleware will handle the error
    // always logs the error
    console.error("ERROR: ", req.method, req.path, error);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("error",{error});
    }
  });
};

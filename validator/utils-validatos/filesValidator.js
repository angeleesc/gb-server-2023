const fileValidator = (req, res, next) => {
  if (!req.files)
    return res.send({
      message: "lo siento pero la imagen es requerida",
    });

  next();
};

export default fileValidator
import { db } from "../firebase/firebase.cjs";

const suValidator = async (req, res, next) => {
  console.log("validadndo usuario");

  const { usuario } = req.headers;

  if (!usuario) {
    return res.status(403).send({
      message: "para el uso de esta ruta es obigatorio el uso del usuario",
      isSuccess: false,
    });
  }

  const userRef = db.collection("users-dashboard").doc(usuario);
  const result = await userRef.get();

  if (!result.exists) {
    res.status(403).send({
      message: "este usuario no tiene cuenta en el dhasboars",
      isSucces: false,
    });
    return;
  }

  if (
    !(
      result.data().rol === "su" ||
      result.data().rol === "yo" ||
      result.data().rol === "master"
    )
  ) {
    res.status(403).send({
      message:
        "lo siento pero no tiene privilegios para realizar dicha operacion",
        isSucces: false,
    });
    return;
  }

  next();
};

export default suValidator;

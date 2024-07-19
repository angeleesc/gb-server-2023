import { dbGB } from "../../firebase/firebase.cjs";

const userValidator = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId)
    return res.status(403).json({
      message: "lo siento pero el id del usuario es requerido",
      isSucces: false,
    });

  const userREf = dbGB.collection("users").doc(userId);
  const result = await userREf.get();

  if (!result.exists)
    res.status(403).json({
      message: "lo siento pero el usuario no existe",
      isSucces: false,
    });

  const { photoURL, displayName } = result.data();

  if (photoURL || photoURL !== false) req.body.userAvatar = photoURL;
  if (displayName) req.body.userName = displayName;

  next();
};

export default userValidator;
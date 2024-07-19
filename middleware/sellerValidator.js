import { db, auth } from "../firebase/firebase.cjs";

const validSeller = async (req, res, next) => {
//   console.log(req.headers);

  const { user, token, clientconsumer } = req.headers;

  if (clientconsumer) {
    if (
      clientconsumer === "gb-punto-de-venta" ||
      clientconsumer === "gb-dashboard"
    ) {
      console.log("clientConsumer", clientconsumer);

      const vendorsResult = await db.collection("vendors").doc(user).get();
      if (!vendorsResult.exists) {
        res.send({
          message: "lo siento pero el usuario no es valido",
          isSuccess: false,
        });
        return;
      }

      // const result = await auth.

      let isValid;

      try {
        isValid = await auth.verifyIdToken(token);
      } catch (error) {
        if (error.code) {
          console.log(error.code);
          if (error.code === "auth/id-token-expired") {
            res.send({
              messsage:
                "lo sioento pero este token esta expirado vuelvase a loguear",
              isSuccess: false,
              isValidToken: false,
            });
          }
          res.send({
            message: "los siento poero ocurrion un erro en la autenticacion",
            error,
          });
          return;
        }
      }

      // console.log(isValid);
      console.log("user", user);

      const { uid } = vendorsResult.data();

      if (!(uid === isValid.uid)) {
        res.send({
          message:
            "lo siento pero no tiene el el titular del token no coincide con el de usuario",
          isSuccess: false,
          isValidToken: false,
        });
        return;
      }

      next();
      return;
    }
  }

  res.send({
    message:
      "lo siento pero la operacion se esta realizando en un cliente no regitrado",
    isSuccess: false,
  });
};

export default validSeller;

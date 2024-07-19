import { Router } from "express";
import speakeasy from "speakeasy"
import qrcode from "qrcode"
import { db, dbGB } from "../firebase/firebase.cjs";

const routes = Router();

routes.post("/google-authenticator-request-qr", async (req, res) => {
    try {
        var secret = speakeasy.generateSecret({
            name: "boxofficeglobalboletos",
        })
        qrcode.toDataURL(secret.otpauth_url, function (err, data) {
            res.send({
                isSuccess: true,
                ascii: secret.ascii,
                qr: data,
                message: "Data enviada con exito",
            });
        })
    } catch (err) {
        console.log(err)
    }
});

routes.post("/google-authenticator-request-qr-boxoffice-reprint", async (req, res) => {
    try {
        var secret = speakeasy.generateSecret({
            name: "boxofficeReprint",
        })
        qrcode.toDataURL(secret.otpauth_url, function (err, data) {
            res.send({
                isSuccess: true,
                ascii: secret.ascii,
                qr: data,
                message: "Data enviada con exito",
            });
        })
    } catch (err) {
        console.log(err)
    }
});


routes.post("/verify-token-google-authenticator", async (req, res) => {
    const { secret, token, userId, initial, sgb } = req.body;
    try {
        var verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "ascii",
            token: parseFloat(token)
        })

        if (verified) {
            if (sgb) {
                if (initial) {
                    await db.collection("users-dashboard").doc(userId).update({ ascii: secret })
                }
            } else {
                if (initial) {
                    await db.collection("vendors").doc(userId).update({ ascii: secret })
                }
            }
            res.send({
                isSuccess: true,
                verified: verified,
                message: "Verificación exitosa",
            });
        } else {
            res.send({
                isSuccess: false,
                verified: false,
                message: "Verificación Erronea",
            });
        }

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            verified: false,
            message: "Ocurrio un error en operación",
        });
    }
});


routes.post("/verify-token-google-authenticator-box-office-reprint", async (req, res) => {
    const { secret, token } = req.body;
    try {
        var verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "ascii",
            token: parseFloat(token)
        })

        if (verified) {
            res.send({
                isSuccess: true,
                verified: verified,
                message: "Verificación exitosa",
            });
        } else {
            res.send({
                isSuccess: false,
                verified: false,
                message: "Verificación Erronea",
            });
        }

    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            verified: false,
            message: "Ocurrio un error en operación",
        });
    }
});


export default routes;

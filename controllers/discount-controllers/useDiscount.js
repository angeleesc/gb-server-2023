import { db } from "../../firebase/firebase.cjs";

export default async function useDiscount(req, res) {

    const { order, discountCode, event } = req.body


    let discountProperties = {}
    let discountedAmount = 0

    try {

        const asociatedDataRefCommission = await db
            .collection("events-logitict")
            .doc(event)
            .collection("affiliatePartners")
            .doc(String(discountCode).replace(/ /g, ""))
            .get()
        if (asociatedDataRefCommission.exists) {
            if (asociatedDataRefCommission.data().planProperties.typeOfCommission === "Fixed") {
                discountProperties = {
                    affiliateCommission: asociatedDataRefCommission.data().planProperties.affiliateCommission,
                    customerDiscount: asociatedDataRefCommission.data().planProperties.customerDiscount,
                    typeOfCommission: asociatedDataRefCommission.data().planProperties.typeOfCommission
                }
                //MONTO CON DESCUENTO
                discountedAmount = asociatedDataRefCommission.data().planProperties.customerDiscount * order.length
                res.send({ message: "Descuento aplicado", order: order, discountedAmount: discountedAmount, isSuccess: true, codeUsed: String(discountCode).replace(/ /g, "") });
            }
        } else {
            res.send({ message: "Error en aplicar descuento, codigo no existe", isSuccess: false, err: "Codigo de descuento no existe4" });
        }

    } catch (err) {
        console.log(err)
        res.send({ message: "Error en aplicar descuento", isSuccess: false, err: err });
    }
} 
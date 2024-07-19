import { dbGB } from "../../firebase/firebase.cjs";

const createPartnerPlan = async (req, res) => {

    const { eventId, planId, commission, customerDiscount, typeOfCommission } = req.body;

    try {
        const planToCreateRef = await dbGB
            .collection("events-logitict")
            .doc(eventId)
            .collection("affiliatePlans")
            .doc(planId)

        const planDataToCreateRef = await dbGB
            .collection("events-logitict")
            .doc(eventId)


        await planToCreateRef
            .set({
                commission: commission,
                customerDiscount: customerDiscount,
                typeOfCommission: typeOfCommission,
                createdAt: new Date()
            });

        await planDataToCreateRef
            .set({
                associatedMarketersTop: 1000,
                remainingAffiliateCoupon: 1000
            });

        res.send({
            isSuccess: true,
            message: "exito usuario agregado",
        });
    } catch (err) {
        console.log(err)

        res.send({
            isSuccess: false,
            message: "Ocurrio un error al crear el plan",
        });
    }

};

export default createPartnerPlan;

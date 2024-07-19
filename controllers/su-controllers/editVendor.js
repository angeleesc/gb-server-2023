import { dbGB } from "../../firebase/firebase.cjs";


const editSeller = async (req, res) => {
    const { data, sellerId } = req.body;

    console.log(data, sellerId)
    const vendorEditShema = {
        email: data.email,
        print: data.print,
        events: data.events,
        lastModilastModified: new Date()
    }

    try {
        await dbGB
            .collection("vendors")
            .doc(sellerId)
            .update({...vendorEditShema});
        res.send({
            isSuccess: true,
            message: "Vendedor Editado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        });
    }
};
export default editSeller


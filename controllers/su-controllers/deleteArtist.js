import { dbGB } from "../../firebase/firebase.cjs";

const deleteArtist = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.send({
            isSuccess: false,
            message: "Se requiere id del documento",
        });
    }

    try {
        await dbGB
            .collection("artistsInHero")
            .doc(id)
            .delete();
        res.send({
            isSuccess: true,
            message: "Artista eliminado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en petición",
        });
    }
};
export default deleteArtist

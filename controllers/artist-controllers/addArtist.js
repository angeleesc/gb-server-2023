import { dbGB } from "../../firebase/firebase.cjs";

const createArtist = async (req, res) => {

    const { data } = req.body;

    if (!data.name || !data.img || !data.route) {
        res.send({
            isSuccess: false,
            message: "Faltan datos por enviar.",
        });
    }

    const artistShema = {
        name: data.name,
        img: data.img,
        route: data.route
    }

    try {
        await dbGB
            .collection("artistsInHero")
            .add(artistShema);
        res.send({
            isSuccess: true,
            message: "Artista agregado",
        });
    } catch (err) {
        console.log(err)
        res.send({
            isSuccess: false,
            message: "Error en peticion",
        })
    }
}

export default createArtist


import axios from "axios";

export default async function searchCne(req, res) {

    const { cedula } = req.body

    try {

        const request = await axios.get(`http://www.cne.gob.ve/web/registro_electoral/ce.php?nacionalidad=V&cedula=${cedula}`)
        let name = ""
        let ci = ""
        let error = false
        const arr = request.data.split("<b>")
        arr.forEach(x => {
            const nameKey = `</b></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td align="left">`
            const matchKey = String(x).includes(nameKey)
            const ciKey = `\t\t\t<td align="left">V-`
            const matchCiKey = String(x).includes(ciKey)

            if (matchKey) {
                const searchValue = x.split("</b>")
                if (searchValue) {
                    if (!String(searchValue[0]).includes(nameKey)) name = searchValue[0]
                }
            }
            if (matchCiKey) {
                const searchValue = x.split("V-")
                if (searchValue) {
                    if (String(searchValue[1]).includes(`</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td align="left">`)) {
                        if (searchValue[1].split("</td>")[0]) ci = searchValue[1].split("</td>")[0]
                    }
                }
            }
        });

        if (name === "") {
            res.send({ message: "No encontraron datos", isSuccess: false, name: false, ci: false });
        } else {
            res.send({ message: "Consulta exitosa", isSuccess: true, name: name, ci: ci });
        }

    } catch (err) {
        console.log(err)
        res.send({ message: "Error", isSuccess: false });
    }
} 
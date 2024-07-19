const createAsociateIdPerEvent = (req, res)=>{

    const {userId, eventId} = req.body;

    // generamos un id unico de afiliado que sera un cifrado de eventis+refid

    const isUnique = false;

    while (!isUnique){
        const id = 
    }

}

export default createAsociateIdPerEvent
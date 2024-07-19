const taxtSchema = {
  IVA: true,
  basePrice: true,
  precioBase: true,
  impMunicipal: true,
  servicioDeTaquilla: true,
  price: true,
};

export default function calTotalSales(places) {
  const acumulator = {
    IVA: 0,
    basePrice: 0,
    precioBase: 0,
    impMunicipal: 0,
    servicioDeTaquilla: 0,
    price: 0,
  };

  const products = {};

  console.log("calculando total de venta");

  for (let place of places) {
    // verificamos los taxes exitente

    for (let keyTaxt in taxtSchema) {
      if (place[keyTaxt])
        acumulator[keyTaxt] = acumulator[keyTaxt] + place[keyTaxt];

      if (products[place.zona]) {
        console.log("esta zona esta agregada");
      } else {
        console.log("esta zona no esta agregada");
        const productAcumulator = { ...acumulator };
        for(let procductAKey in productAcumulator){
            
        }
      }
    }

    // console.log(place);
  }

  const dataToReturn = {};

  for (let keyAcumulator in acumulator) {
    if (acumulator[keyAcumulator] > 0) {
      dataToReturn[keyAcumulator] = acumulator[keyAcumulator];
    }
  }

  const Products = {};

  dataToReturn.total = acumulator.price;

  //   console.table(acumulator);
  return dataToReturn;
}

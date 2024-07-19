import { format } from "date-fns";
import { customAlphabet } from "nanoid";

export const generateUniQueEventFacturation = () => {
  const timeId = new Date();
  const nanoid = customAlphabet("1234567890", 10);

  const dateId = format(timeId, "y-MMdd-HHmm-ss");
  const timed = timeId.getTime();
  const ramdomId1 = nanoid(5);
  const ramdomId2 = nanoid(5);

  const id = `GB-${dateId}-${timed}-${ramdomId1}-${ramdomId2}`;
  const lastTenDiginId = ramdomId1 + "-" + ramdomId2;

  return {
    id,
    dateId,
    ramdomId1,
    ramdomId2,
    timed,
    lastTenDiginId,
  };
};

export const generateUniqueCredentialID = (planID) => {
  const nanoid = customAlphabet("1234567890ABCDEF", 10);
  const credentiaId1º = nanoid(4);
  const credentiaId2º = nanoid(4);
  const credentiaId3º = nanoid(4);
  const credentiaId4º = nanoid(4);
  const credentiaId5º = nanoid(4);

  console.log(credentiaId1º);
  console.log(credentiaId2º);
  console.log(credentiaId3º);
  console.log(credentiaId4º);
  console.log(credentiaId5º);

  return (
    planID +
    "-" +
    credentiaId1º +
    "-" +
    credentiaId2º +
    "-" +
    credentiaId3º +
    "-" +
    credentiaId4º +
    "-" +
    credentiaId5º
  );
};

export const generateChatId = () => {
  // generamos el tiempo
  const dateTimeStamp = new Date().getTime();
  const hash16 = dateTimeStamp.toString(16).toUpperCase();
  const nanoid = customAlphabet("1234567890ABCDEF", 10);
  const ramdomId = nanoid(8);

  // 181BFE6FEB0
  const id = `${hash16}-${ramdomId}`;
  return id;
};

export const generateAscociatedId = (eveniId, cuantity) => {
  const n = cuantity;

  console.log(cuantity);

  let id;

  const nanoId = customAlphabet("1234567890ABCDEFG", 32);
  switch (true) {
    case n >= 1 && n <= 99:
      id = nanoId(3);
      break;
    case n >= 100 && n <= 999:
      id = nanoId(6);
      break;
    default:
      console.log("data invalida");
  }

  return {
    id,
    refEventId: eveniId+'-'+id,
  };
};

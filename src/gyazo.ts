// @ts-expect-error
import Gyazo from "gyazo-api";

export async function uploadGyazo(path: string): Promise<string> {
  const { GYAZO_ACCESSTOKEN } = process.env;
  if (!GYAZO_ACCESSTOKEN)
    throw new Error(`GYAZO_ACCESSTOKEN: ${GYAZO_ACCESSTOKEN}`);

  const client = new Gyazo(GYAZO_ACCESSTOKEN);

  const res = await client.upload(path).catch(function (err: any) {
    console.error(err);
  });

  return res.data.url as string;
}

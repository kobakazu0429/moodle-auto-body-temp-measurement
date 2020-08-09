// @ts-expect-error
import Gyazo from "gyazo-api";

export async function uploadGyazo(
  path: string,
  title: string
): Promise<string> {
  const { gyazo_accesstoken } = process.env;
  if (!gyazo_accesstoken)
    throw new Error(`gyazo_accesstoken: ${gyazo_accesstoken}`);

  const client = new Gyazo(gyazo_accesstoken);

  const res = await client
    .upload(path, {
      title,
      desc: title,
    })
    .catch(function (err: any) {
      console.error(err);
    });

  return res.data.url as string;
}

import axios from "axios";

export async function sendToSlack(img: { url: string; title: string }) {
  const { slack_incoming_web_hook } = process.env;

  if (!slack_incoming_web_hook)
    throw new Error(`slack_incoming_web_hook: ${slack_incoming_web_hook}`);

  const res = await axios.post(slack_incoming_web_hook, {
    blocks: [
      {
        type: "image",
        title: {
          type: "plain_text",
          text: img.title,
          emoji: true,
        },
        image_url: img.url,
        alt_text: "marg",
      },
    ],
  });
  if (res.data === "ok") {
    console.log("sendToSlack: successed");
  } else {
    console.log("sendToSlack: failed");
    console.log(res);
  }
}

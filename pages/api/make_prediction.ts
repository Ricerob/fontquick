import type { NextApiRequest, NextApiResponse } from "next";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const makePred = httpsCallable(functions, 'makePrediction');

type Data = {
  data: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt } = req.body;

  makePred({ prompt: prompt }).then((result) => {
    console.log(result);
    const resultData = result.data as string;
    res.status(200).json({ data: resultData });
  }).catch((error) => {
    console.log(error);
    res.status(500).send(error.message);
  });
}

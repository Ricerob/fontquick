import * as functions from "firebase-functions";


export const makePrediction = functions.https.onCall((data, context) => {
    const prompt = data.prompt;
    return {
        message: 'recieved',
        prompt: prompt,
    };
});

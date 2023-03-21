import * as functions from "firebase-functions";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const makePrediction = functions.https.onRequest((request, response) => {
    functions.logger.info("hello from makePrediciton", {structuredData: true});
    response.send("hello from makePrediction");
});

import * as functions from "firebase-functions";
import admin from 'firebase-admin'
import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

class npyjs {

    dtypes: { [key: string]: { name: string, size: number, arrayConstructor: any } };

    constructor(opts?: any) {
        if (opts) {
            console.error([
                "No arguments accepted to npyjs constructor.",
                "For usage, go to https://github.com/jhuapl-boss/npyjs."
            ].join(" "));
        }

        this.dtypes = {
            "<u1": {
                name: "uint8",
                size: 8,
                arrayConstructor: Uint8Array,
            },
            "|u1": {
                name: "uint8",
                size: 8,
                arrayConstructor: Uint8Array,
            },
            "<u2": {
                name: "uint16",
                size: 16,
                arrayConstructor: Uint16Array,
            },
            "|i1": {
                name: "int8",
                size: 8,
                arrayConstructor: Int8Array,
            },
            "<i2": {
                name: "int16",
                size: 16,
                arrayConstructor: Int16Array,
            },
            "<u4": {
                name: "uint32",
                size: 32,
                arrayConstructor: Int32Array,
            },
            "<i4": {
                name: "int32",
                size: 32,
                arrayConstructor: Int32Array,
            },
            "<u8": {
                name: "uint64",
                size: 64,
                arrayConstructor: BigUint64Array,
            },
            "<i8": {
                name: "int64",
                size: 64,
                arrayConstructor: BigInt64Array,
            },
            "<f4": {
                name: "float32",
                size: 32,
                arrayConstructor: Float32Array
            },
            "<f8": {
                name: "float64",
                size: 64,
                arrayConstructor: Float64Array
            },
        };
    }

    parse(arrayBufferContents: ArrayBuffer) {
        // const version = arrayBufferContents.slice(6, 8); // Uint8-encoded
        const headerLength = new DataView(arrayBufferContents.slice(8, 10)).getUint8(0);
        const offsetBytes = 10 + headerLength;

        const hcontents = new TextDecoder("utf-8").decode(
            new Uint8Array(arrayBufferContents.slice(10, 10 + headerLength))
        );
        const header = JSON.parse(
            hcontents
                .toLowerCase() // True -> true
                .replace(/'/g, '"')
                .replace("(", "[")
                .replace(/,*\),*/g, "]")
        );
        const shape = header.shape;
        const dtype = this.dtypes[header.descr];
        const nums = new dtype["arrayConstructor"](
            arrayBufferContents,
            offsetBytes
        );
        return {
            dtype: dtype.name,
            data: nums,
            shape,
            fortranOrder: header.fortran_order
        };
    }

    async load(filename: URL, callback?: Function, fetchArgs?: RequestInit) {
        /*
        Loads an array from a stream of bytes.
        */
        fetchArgs = fetchArgs || {};
        const resp = await fetch(filename, { ...fetchArgs });
        const arrayBuf = await resp.arrayBuffer();
        const result = this.parse(arrayBuf);
        if (callback) {
            return callback(result);
        }
        return result;
    }
}

admin.initializeApp()

const storage = admin.storage();

// TODO: Make env variable
const filePath = 'v1_font_embeddings.npy'

export const makePrediction = functions.https.onCall(async (data, context) => {
    const prompt = data.prompt;

    functions.logger.log(`prompt: ${prompt}`)
    functions.logger.log(`file path: ${filePath}`);

    const n = new npyjs();

    // Downloading .npy file
    try {
        // Create a temporary file to store the downloaded file
        const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

        // Download the file from Firebase Storage
        await storage.bucket().file(filePath).download({destination: tempFilePath});

        // Read the file data
        const fileData = fs.readFileSync(tempFilePath);

        // Send the file data as a response
        return {
            data: fileData
        };
    } catch (error) {
        console.error(error);
        return {
            error: error
        };
    }

    try {
        console.log(n)
    } catch (err) {
        console.error(err)
    }

    return {
        message: 'recieved',
        prompt: prompt,
    };
});

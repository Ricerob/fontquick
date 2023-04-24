import type { NextApiRequest, NextApiResponse } from "next";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as dbRef, child, get } from "firebase/database";
import fs from 'fs';

type FontRec = {
  index: number,
  cosineSimilarity: number;
};

type FontInfo = {
  author: string,
  downloads: number,
  img: string,
  license: string,
  name: string,
}

type FontInfoResponse = {
  info?: FontInfo[],
  body: string
}

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
    const resp = await fetch(filename.toString(), { ...fetchArgs });
    const arrayBuf = await resp.arrayBuffer();
    const result = this.parse(arrayBuf);
    if (callback) {
      return callback(result);
    }
    return result;
  }
}

var local = true;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FontInfoResponse>
) {
  const { prompt } = req.body;

  const storage = getStorage();
  const pathReference = ref(storage, 'v1_font_embeddings.npy');

  console.time('!! Total function time')

  if (local) {
    let info = await getFontsLocal(prompt);
    console.timeEnd('!! Total function time')
    res.status(200).json({info, body: "OK"})
    return;
  }


  getDownloadURL(pathReference).then(async (url) => {
    const n = new npyjs();
    var cached = false;
    var result = [];

    // If we don't have a cached DB
    if (!cached) {
      // Fetch data
      console.time('Data fetch')
      const response = await fetch(url);
      console.timeEnd('Data fetch')

      // Transfer to arrayBuffer
      console.time('To arrayBuffer')
      const data = await response.arrayBuffer();
      console.timeEnd('To arrayBuffer')


      // Parsing buffer
      console.time('Parsing to NpyJS buffer')
      const arr = await n.parse(data);
      console.timeEnd('Parsing to NpyJS buffer')


      // Sort npy array
      console.time('Sorting npy array')
      result = [];
      const rowLength = 384;
      let row = [];
      for (const key in arr.data) {
        row.push(arr.data[key]);
        if (row.length === rowLength) {
          result.push(row);
          row = [];
        }
      }
      console.timeEnd('Sorting npy array')
    }

    // Get prompt embeddings
    console.time('Get prompt embedding')
    const promptEmbed = await getEmbedding(prompt);
    console.timeEnd('Get prompt embedding')

    // Calculate cosine similarity
    if (!result || result.length === 0) {
      res.status(400).json({ body: "Failed to grab array." })
      return;
    }

    console.time('Cosine similarity')
    const cosineSimilarities = result.map((row, index) => {
      return {
        index: index,
        cosineSimilarity: cosine(promptEmbed, row)
      };
    });
    cosineSimilarities.sort((a, b) => {
      return b.cosineSimilarity - a.cosineSimilarity;
    });

    // Grab top five and return
    const topFive = cosineSimilarities.slice(0, 5);
    console.log(topFive);
    console.timeEnd('Cosine similarity')

    console.time('Grab font info')
    const info = await getFontInfo(topFive)
    console.timeEnd('Grab font info')

    console.timeEnd('!! Total function time')

    res.status(200).json({ info, body: "OK" })
    return;
  }).catch((err) => {
    console.error(err)
    return;
  })
}

async function getFontInfo(top: FontRec[]): Promise<FontInfo[]> {
  const databaseRef = dbRef(getDatabase());
  let info: FontInfo[] = []

  for (const font of top) {
    try {
      const snapshot = await get(child(databaseRef, Number(font.index).toString()));
      if (snapshot.exists()) {
        const inf = snapshot.val();
        info.push({
          author: inf.author,
          downloads: inf.downloads,
          img: inf.img,
          name: inf.name,
          license: inf.license
        })
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return info
}

async function getFontsLocal(prompt: string): Promise<FontInfo[]> {
  const n = new npyjs();
  var result = [];

  const data = await fs.readFileSync('./public/v1_font_embeddings.npy')
  const uint8Array = new Uint8Array(data)
  let buf = uint8Array.buffer

  let arr = await n.parse(buf);

  // Sort npy array
  console.time('Sorting npy array')
  result = [];
  const rowLength = 384;
  let row = [];
  for (const key in arr.data) {
    row.push(arr.data[key]);
    if (row.length === rowLength) {
      result.push(row);
      row = [];
    }
  }
  console.timeEnd('Sorting npy array')

  // Get prompt embeddings
  console.time('Get prompt embedding')
  const promptEmbed = await getEmbedding(prompt);
  console.timeEnd('Get prompt embedding')

  console.time('Cosine similarity')
  const cosineSimilarities = result.map((row, index) => {
    return {
      index: index,
      cosineSimilarity: cosine(promptEmbed, row)
    };
  });
  cosineSimilarities.sort((a, b) => {
    return b.cosineSimilarity - a.cosineSimilarity;
  });

  // Grab top five and return
  const topFive = cosineSimilarities.slice(0, 5);
  console.log(topFive);
  console.timeEnd('Cosine similarity')

  console.time('Grab font info')
  const info = await getFontInfo(topFive)
  console.timeEnd('Grab font info')

  return info
}



function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.log(`a: ${a.length}, b: ${b.length}`)
    throw new Error("Vectors must be of equal length for cosine similarity calculation.");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  return dotProduct / (normA * normB);
}

async function getEmbedding(prompt: string): Promise<number[]> {
  let embedding: number[];
  let key = process.env.HF_KEY;

  if (!key) {
    throw new Error('Couldn\'t get HuggingFace key from environment.')
  }

  const jsonResponse = await fetch("https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L12-v2", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      'inputs': prompt,
      'options': {
        'wait_for_model': true
      }
    })
  });

  const data = await jsonResponse.json();

  embedding = data;

  console.log(`Got embedding of length ${embedding.length}`)

  return embedding;
}
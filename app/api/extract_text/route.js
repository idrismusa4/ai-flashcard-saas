import pdf from 'pdf-parse/lib/pdf-parse'
import fs from "fs";
import path from "path";
import formidable from "formidable";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// export async function GET(req, res) {
//  return new Response("GET working...")
// }

export async function POST(req) {
    // // Read the request body
    // const body = await req.json();
  
    // // Extract the 'plan' property
    // const { product_name, product_price } = body;
  
    console.log("---here 0---");
// export default async function handler(req, res) {
  const form = new formidable();
  // form.uploadDir = path.join(process.cwd(), "public/uploads");
  // form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    console.log("---here 1---");
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }
    console.log("---here 2---");

    const file = files.file[0];
    const filePath = file.filepath;

    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      console.log(data, "------", data.text);
      res.status(200).json({ text: data.text });
    } catch (error) {
      res.status(500).json({ error: "Error extracting text from PDF" });
    }
  });
}

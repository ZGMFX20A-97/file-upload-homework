import express from "express";
import multer from "multer";
import path from "path";
import { readFile } from "fs/promises";
import crypto from "crypto";
import { listFiles, uploadFile } from "@/lib/S3";
import { appendFileToDb } from "./db";


//サーバーインスタンス
const app = express();
//パーサーインスタンス→パースしたファイルは臨時的にルートディレクトリ下のuploads/フォルダに保存する
const upload = multer({ dest: "uploads/" });

const ACCEPTED_IMAGE_TYPES = [
	".jpeg",
	".png",
	".webp",
	".tif",
	".bmp",
	".gif"
];
//upload.single("file")はミドルウェアとしてリクエスト内の単一のファイルをパースしてrequestに入れる
app.post("/upload/:userId", upload.single("file"), async (req, res) => {
    //パスパラメーターからファイルをアップロードしたユーザーのIDを取得
    const userId = req.params.userId;
    //パーサーによって、リクエストからアップロードされたファイルを取り出せる
    const file = req.file;
    //ファイルの拡張子を取得
    const ext = path.extname(file.originalname);
    if(!ACCEPTED_IMAGE_TYPES.includes(ext)){
        res.status(400).json({ errorMessage: "画像ファイルをアップロードしてください" });
    }
    //S3へアップロードするときにオブジェクトを識別するためのキーが必要
    //どのユーザーがアップロードしたのかを判別するためにキーの中にユーザーIDを組み込む
    const key = `uploads/${userId}${ext}`;

    const body = await readFile(file.path);

    try {
        await uploadFile(key, body)
        const uri = `https://${process.env.AWS_BUCKET_NAME!}.s3.amazonaws.com/${key}`;
        appendFileToDb(uri, '1');
        res.status(200);
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }

});
app.get("/getFiles/:userId", async (req, res) => {
    try {
        //パスパラメーターからファイルをアップロードしたユーザーのIDを取得
        const userId = req.params.userId;

        const objects = await listFiles(userId,"3");
        res.status(200).json(objects)
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }

})

app.listen(3000, () => {
    console.log("サーバー起動ーーーhttp://localhost:3000");
});
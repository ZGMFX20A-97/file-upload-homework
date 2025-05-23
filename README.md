# 詳細設計

# モージュル概要

ユーザーからファイルを受け取り、そのファイルを外部ストレージサービスへアップロードし保存する機能、またアップロードされた画像をAmazon S3 URIを通して、プレビューを表示する機能を持つ。

# シーケンス

ユーザーがファイルを選択する

↓

JavaScriptでファイルをFormDataへ詰め込む

↓

fetchで /upload APIを通してバックエンドへPOSTリクエストを送る

↓

バックエンドが multipart/form-data リクエストを受け取る

↓

受け取ったファイルデータをパースする

↓

ファイルデータをS3へ送り、保存する

↓

S3から成功したレスポンスを受け取る

↓

バックエンドでアップロードしたファイルのURIを生成し、DBへ保存する。例：https://{bucketName}.s3.amazonaws.com/${key}

↓

FilesPreviewコンポーネントで /getFiles APIを通してアップロードされたバケット内のフロントでURIを使って画像のプレビューを表示する。

# API

## POST /upload/[userId]

**RequestBody：formData{image/jpg || image/bmp || image/gif || image/png || image/tiff etc…}**

**Response：StatusCode 201 Created/406 Not Acceptable/413 Payload Too Large/403 Forbidden/500 Internal Server Error**

フロントからアップロードされたファイルを受け取り、S3へアップロードするためのAPI。

userIdをパスパラメータから取得し、S3バケットへアップロードする際にどのユーザーがアップロードしたのかを判別するためにオブジェクトキーへ組み込む

## GET /getFiles/[userId]

**Request：**

**Response： StatusCode 200 OK/401 Unauthorized/500 Internal Server Error**
             List[string]

アップロードしたファイルを取得する。

userIdをパスパラメータから取得し、該当ユーザーがアップロードしたファイルのみプレビューを展示する。

# DB

## users

userid:text(256) -primarykey notnull

username:varchar(256)

## file

filekey: text(S3オブジェクトキーの長さ),

user_id: users.userid -foreignkey

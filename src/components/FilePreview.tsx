import { useEffect, useState } from "react";

const FilePreview = () => {
	const [files, setFiles] = useState([]);
	useEffect(() => {
		const getFiles = async () => {
			const response = await fetch("http://localhost:3000/getFiles");
			if (response.status === 200) {
				const data = await response.json();
				setFiles(data);
			}
		};
	}, []);
	return (
		//時間切迫しているため、スタイルの適用は割愛する。
		<div>
			<h2>アップロードされたファイル：</h2>
			<ul>
				{files.map((file) => (
					<img
						key={file.key}
						src={`https://${process.env.AWS_BUCKET_NAME!}.s3.amazonaws.com/${file.key}`}
						alt="画像プレビュー"
					/>
				))}
			</ul>
		</div>
	);
};

export default FilePreview;

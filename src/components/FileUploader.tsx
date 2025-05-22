import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

//画像ファイルのみ受け取るため、許されるファイル形式のリストを定義
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/tif",
	"image/bmp",
	"image/gif"
];

//zodでformスキーマを定義する、今回の場合は画像ファイルのみにする
const formSchema = z.object({
	file: z
		.any() //ファイルは複雑な形式があるため、anyにする
		.refine((file) => file instanceof File || file?.[0] instanceof File, {
			//ファイルであることを検証する
			message: "ファイルを選択してください"
		})
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
			message: "画像ファイルを選択してください"
		})
});

//アップロードボタンを押下したらバックエンドへファイルを送る
async function onSubmit(data: z.infer<typeof formSchema>) {
	const formData = new FormData();
	formData.append("file", data.file);
  //今度はログインユーザー情報取得を割愛し、userIdパラメーターにDB初期化時に存在するユーザーIDー１をハードコードで入れる。
	const res = await fetch("http://localhost:3000/upload/1", {
		method: "POST",
		body: formData
	});
	if (res.status === 200) {
		toast("アップロードが成功しました！", {
      duration:3000,
			description: new Date().toLocaleString("ja-JP", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit"
			})
		});
	}else{
    toast("何かエラーが発生しました")
  }
}

export const FileUploader = () => {
	//formSchemaを用いてformを作る
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			file: undefined
		}
	});

	return (
		//React-hook-form
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									type="file"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								ファイルをアップロードしてください
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">アップロードする</Button>
			</form>
		</Form>
	);
};

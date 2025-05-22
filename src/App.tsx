import "./index.css";
import { FileUploader } from "./components/FileUploader";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton
} from "@clerk/clerk-react";
import { Toaster } from "sonner";
import FilePreview from "./components/FilePreview";

export function App() {
	return (
		<>
			<Toaster />
      <div><FileUploader /></div>
			<div className="mt-10"><FilePreview /></div>
      
		</>
	);
}

export default App;

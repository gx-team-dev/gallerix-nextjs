"use client";

import { Button } from "@/components/ui/button";
import UppyUploader from "@/components/UppyUploader/UppyUploader";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import path from "path";


export default function Page() {

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadButtonClick = async () => {
    // Här kan du hantera knappklicket, t.ex. starta en uppladdning
    console.log("Upload button clicked");

    setIsLoading(true);

    const datePrefix = new Date().toISOString().slice(0, 10);

    const imgPath = path.join(process.cwd(), 'public', 'temp/IMG_4601.JPG');

    const res = await fetch('/api/upload-spaces', {
      method: 'POST',
      body: JSON.stringify({
        filePath: imgPath,
        key: `test/${datePrefix}.jpg`, // Var filen ska hamna i bucketen
        acl: 'private' // eller 'public-read' om du vill att filen ska vara publikt åtkomlig
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();
    console.log('Server upload response:', data);
    setIsLoading(false);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload to DO</h1>
      <UppyUploader />

      <Button className="mt-4" onClick={handleUploadButtonClick}>{isLoading ? <CgSpinner className="animate-spin" /> : <IoCloudUploadOutline size={25} />}</Button>
    </main>
  );
}
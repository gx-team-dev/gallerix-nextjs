"use client";

import { Button } from "@/components/ui/button";
import UppyUploader from "@/components/UppyUploader/UppyUploader";
import { IoCloudUploadOutline } from "react-icons/io5";
import { CgSpinner } from "react-icons/cg";
import { MdOutlineFindInPage } from "react-icons/md";
import { useState } from "react";

export default function Page() {

  const [isLoading, setIsLoading] = useState(false);

  const handleUploadButtonClick = async () => {
    // Här kan du hantera knappklicket, t.ex. starta en uppladdning
    console.log("Upload button clicked");

    setIsLoading(true);

    const datePrefix = new Date().toISOString().slice(0, 10);

    const res = await fetch('/api/upload-spaces', {
      method: 'POST',
      body: JSON.stringify({
        filePath: 'bigtest.pdf',
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

  const handleFetchFile = async () => {
    setIsLoading(true);
    const res = await fetch('/api/file');
    const blob = await res.blob();
    console.log('Fetched file response:', res);
    console.log('Fetched file blob:', blob);
    setIsLoading(false);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload to DO</h1>
      <UppyUploader />

      <div className="flex gap-2 mt-4">
        <Button onClick={handleUploadButtonClick}>{isLoading ? <CgSpinner className="animate-spin" /> : <IoCloudUploadOutline size={25} />}</Button>

        <Button onClick={handleFetchFile}>{isLoading ? <CgSpinner className="animate-spin" /> : <MdOutlineFindInPage  size={25} />}</Button>
      </div>
    
    </main>
  );
}
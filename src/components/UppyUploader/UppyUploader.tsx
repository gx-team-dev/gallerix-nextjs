// components/UppyUploader.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";

import "../../../node_modules/@uppy/core/dist/style.min.css";
import "../../../node_modules/@uppy/dashboard/dist/style.min.css";

export default function UppyUploader() {
  const uppyRef = useRef<Uppy | null>(null);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  if (!uppyRef.current) {
    uppyRef.current = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        maxFileSize: 20 * 1024 * 1024, // 20 MB demo
      },
    });

    // Skicka filen till vår server, som i sin tur laddar upp till B2
    uppyRef.current.use(XHRUpload, {
      endpoint: "/api/upload",
      method: "POST",
      formData: true,
      fieldName: "file", // ska matcha servern
      bundle: false,
      getResponseData: (xhr: XMLHttpRequest) => {
        try {
          return JSON.parse(xhr.responseText);
        } catch {
          return {};
        }
      },
    });

    uppyRef.current.on("upload-success", (file: any, response: any) => {
      const url = response?.body?.publicUrl || null;
      setLastUrl(url);
    });

    uppyRef.current.on("error", (err:any) => {
      console.error("Uppy error:", err);
      alert(`Fel: ${String(err)}`);
    });
  }

  useEffect(() => {
    return () => {
      // Cleanup
      const uppy = uppyRef.current;
      if (!uppy) return;
      (uppy as any).cancelAll?.();
      (uppy as any).reset?.();
      uppyRef.current = null;
    };
  }, []);

  return (
    <div className="max-w-xl">
      <Dashboard
        uppy={uppyRef.current}
        proudlyDisplayPoweredByUppy={false}
        width="100%"
        height={360}
        note="Max 20 MB" 
      />
      {lastUrl && (
        <p style={{ marginTop: 12, wordBreak: "break-all" }}>
          Klart! Publik URL: <a href={lastUrl} target="_blank" rel="noreferrer">{lastUrl}</a>
        </p>
      )}
    </div>
  );
}

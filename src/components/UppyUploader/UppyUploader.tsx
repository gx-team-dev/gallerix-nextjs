"use client"

import { useEffect, useMemo, useRef } from "react"
import Uppy from "@uppy/core"
import Dashboard from "@uppy/dashboard"
import AwsS3 from "@uppy/aws-s3"
import "../../../node_modules/@uppy/core/dist/style.css"
import "../../../node_modules/@uppy/dashboard/dist/style.css"

type PresignResponse = {
  method: "PUT"
  url: string
  headers: Record<string, string>
  key: string
  publicUrl: string
}

export type UploadedFile = { name: string; url: string; key: string }

type UppyUploaderProps = {
  maxNumberOfFiles?: number
  allowedFileTypes?: string[] | null
  note?: string
  onFileUploaded?: (file: any) => void
  onComplete?: () => void
  height?: number
}

export default function UppyUploader({
  maxNumberOfFiles = 5,
  allowedFileTypes = null,
  note = "Ladda upp filer direkt till DigitalOcean Spaces",
  onFileUploaded,
  onComplete,
  height = 360,
}: UppyUploaderProps) {
  const dashRef = useRef<HTMLDivElement | null>(null)

  const uppy = useMemo(
    () =>
      new Uppy({
        restrictions: {
          maxNumberOfFiles,
          allowedFileTypes: allowedFileTypes || undefined,
        },
        autoProceed: false,
      }),
    [maxNumberOfFiles, allowedFileTypes]
  )

  useEffect(() => {
    if (!dashRef.current) return

    // Dashboard-plugin
    uppy.use(Dashboard, {
      inline: true,
      target: dashRef.current,
      proudlyDisplayPoweredByUppy: false,
      showRemoveButtonAfterComplete: true,
      height,
      note,
    });

    // AwsS3 med presign per fil (en call per fil)
    (uppy as any).use(AwsS3, {
      async getUploadParameters(file: any) {
        const res = await fetch("/api/s3-presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || "application/octet-stream",
          }),
        })
        if (!res.ok) throw new Error("Kunde inte få presigned URL")
        const data: PresignResponse = await res.json()

        // Lägg publicUrl/nyckel på filens meta för senare användning
        uppy.setFileMeta(file.id, { _publicUrl: data.publicUrl, _key: data.key })

        return {
          method: data.method,
          url: data.url,
          headers: data.headers,
        }
      },
    });

    // Event: en fil klar
    uppy.on("upload-success", (file) => {
      if (!file) return

      const rawUrl = (file.meta as any)._publicUrl
      const rawKey = (file.meta as any)._key

      // runtime guard -> now we can assign to definite string types
      if (typeof rawUrl === "string" && typeof rawKey === "string") {
        const url: string = rawUrl
        const key: string = rawKey
        onFileUploaded?.({ name: file.name, url, key })
      }
    })

    // Event: alla klara
    uppy.on("complete", () => onComplete?.())

    return () => {
      // Stop any inflight uploads and clear files/state (cast to any to avoid type conflicts)
      ;(uppy as any).cancelAll?.()
      ;(uppy as any).reset?.()

      // If you need to close the Dashboard UI plugin explicitly, call it on the plugin (cast to any)
      const dashboard = (uppy as any).getPlugin?.("Dashboard") as any
      dashboard?.close?.()

      // Optionally destroy the uppy instance if you created it manually elsewhere:
      ;(uppy as any).close?.({ reason: "unmount" })
    }
  }, [uppy, note, height, onFileUploaded, onComplete])

  return <div ref={dashRef} />
}

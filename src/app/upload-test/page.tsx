// app/page.tsx
import UppyUploader from "@/components/UppyUploader/UppyUploader";


export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Upload to BB</h1>
      <UppyUploader />
    </main>
  );
}
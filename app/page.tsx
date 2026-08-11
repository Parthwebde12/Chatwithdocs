import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-semibold mb-8">Chat with your Documents</h1>
      <FileUpload />
    </main>
  );
}
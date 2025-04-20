import FileUploader from "./Components/FileUploader";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen w-screen flex text-white bg-gray-900">
        {/* left side */}
        <div className="w-[50vw] min-h-screen text-white flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-emerald-300">
              Chat to NextDoc AI
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Upload your PDF to start the conversation
            </p>
            <FileUploader />
          </div>

          {/* Background decorative elements */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl"></div>
            <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-emerald-900/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* right side */}
        <div className="w-[50vw] min-h-screen border-l-2">2</div>
      </div>
    </div>
  );
}

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fa]">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              BIS Standards AI Assistant
            </h1>
            <p className="text-xs text-slate-500">
              Intelligent assistance for Indian Standards
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-slate-600">
              System Online
            </span>
          </div>
        </header>


        <div className="border-b border-slate-200 bg-white px-6 py-2">
          <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto text-[11px] font-medium uppercase tracking-wide text-slate-500">
            <span className="whitespace-nowrap text-blue-900">
              BIS Standards
            </span>

            <span className="text-slate-300">•</span>

            <span className="whitespace-nowrap">
              Standards Search
            </span>

            <span className="text-slate-300">•</span>

            <span className="whitespace-nowrap">
              Compliance
            </span>

            <span className="text-slate-300">•</span>

            <span className="whitespace-nowrap">
              Certification
            </span>
          </div>
        </div>

        <section className="min-h-0 flex-1">
          <ChatWindow />
        </section>
      </main>
    </div>
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <ChatWindow />
    </main>
  );
}

export default App;
import { useState } from "react";
import SourceCard from "./SourceCard";

function ChatWindow() {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string; sources?: { title: string; description: string }[] }[]
    >([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage || isLoading) return;

        const userMsg = { role: "user" as const, content: trimmedMessage };

        setMessages((previousMessages) => [
            ...previousMessages,
            userMsg,
        ]);

        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query_text: trimmedMessage,
                    top_k: 3,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server status ${response.status}`);
            }

            const data = await response.json();

            let assistantContent = "";
            let sourcesList: { title: string; description: string }[] = [];

            if (data.results && data.results.length > 0) {
                // Pick the result with highest keyword relevance to query
                const queryWords = trimmedMessage.toLowerCase().split(/\s+/).filter(w => w.length > 3);
                let bestMatch = data.results[0];
                let maxHits = -1;

                for (const item of data.results) {
                    const fullStr = `${item.title || ''} ${item.standard_number || ''} ${item.text || ''}`.toLowerCase();
                    const hits = queryWords.reduce((acc, w) => acc + (fullStr.includes(w) ? 1 : 0), 0);
                    if (hits > maxHits) {
                        maxHits = hits;
                        bestMatch = item;
                    }
                }

                assistantContent = bestMatch.text || `Relevant Standard Found: ${bestMatch.title || bestMatch.standard_number}`;

                sourcesList = data.results.map((item: any) => ({
                    title: `${item.standard_number || item.standard_id || "BIS Standard"} - ${item.title || "Indian Standard"}`,
                    description: item.text ? (item.text.length > 150 ? item.text.substring(0, 150) + "..." : item.text) : `Match Score: ${(item.score * 100).toFixed(1)}%`,
                }));
            } else {
                assistantContent = "No matching BIS standards found for your query. Please rephrase or check standard codes.";
            }

            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    role: "assistant",
                    content: assistantContent,
                    sources: sourcesList,
                },
            ]);
        } catch (err) {
            console.error("Backend fetch error:", err);
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    role: "assistant",
                    content: "Could not connect to the backend server. Please make sure Uvicorn backend is running on http://localhost:8000.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex h-full flex-col bg-[#f5f7fa]">

            {/* Welcome Area */}

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-xl font-bold text-white shadow-sm">
                            BIS
                        </div>

                        <h2 className="text-center text-2xl font-semibold text-slate-900">
                            How can BIS Assistant help you?
                        </h2>

                        <p className="mt-2 max-w-lg text-center text-sm leading-6 text-slate-500">
                            Search Indian Standards, understand requirements, and get
                            standards-based answers in one place.
                        </p>

                        {/* Quick actions */}
                        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">

                            <button
                                onClick={() =>
                                    setMessage(
                                        "Help me find the relevant BIS standard for my product."
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                            >
                                <p className="text-sm font-medium text-slate-800">
                                    Find a Standard
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Search for relevant BIS standards.
                                </p>
                            </button>

                            <button
                                onClick={() =>
                                    setMessage(
                                        "What BIS requirements should I check for product compliance?"
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                            >
                                <p className="text-sm font-medium text-slate-800">
                                    Check Compliance
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Understand applicable requirements.
                                </p>
                            </button>

                            <button
                                onClick={() =>
                                    setMessage(
                                        "Explain the relevant BIS standard in simple terms."
                                    )
                                }
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                            >
                                <p className="text-sm font-medium text-slate-800">
                                    Explain a Standard
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Get complex standards explained simply.
                                </p>
                            </button>

                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${msg.role === "user"
                                        ? "rounded-br-md bg-blue-900 text-white"
                                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                        }`}
                                >
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-60">
                                        {msg.role === "user" ? "You" : "BIS Assistant"}
                                    </div>

                                    <div>{msg.content}</div>

                                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 border-t border-slate-200 pt-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Retrieved Sources ({msg.sources.length})
                                            </p>

                                            {msg.sources.map((src, sIdx) => (
                                                <SourceCard
                                                    key={sIdx}
                                                    title={src.title}
                                                    description={src.description}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        BIS Assistant
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400"></span>
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]"></span>
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]"></span>

                                        <span className="ml-1 text-xs text-slate-400">
                                            Thinking...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>


            {/* Input Area */}
            <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-4xl items-center gap-3 rounded-xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
                >

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about BIS standards, certification, or compliance..."
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!message.trim()}
                    >
                        Ask BIS
                    </button>

                </form>

                <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-slate-400">
                    BIS Assistant provides AI-generated assistance. Verify critical
                    requirements against official BIS documentation.
                </p>

            </div>
        </div>
    );
}

export default ChatWindow;
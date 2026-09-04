import { useState } from "react";
import SourceCard from "./SourceCard";

function ChatWindow() {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; content: string }[]
    >([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage || isLoading) return;

        setMessages((previousMessages) => [
            ...previousMessages,
            {
                role: "user",
                content: trimmedMessage,
            },
        ]);

        setMessage("");
        setIsLoading(true);

        setTimeout(() => {
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    role: "assistant",
                    content:
                        "Your query has been received. BIS Assistant will process it.",
                },
            ]);

            setIsLoading(false);
        }, 1200);
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

                                    {msg.role === "assistant" && (
                                        <div className="mt-4 border-t border-slate-200 pt-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                                Sources
                                            </p>

                                            <SourceCard
                                                title="BIS document"
                                                description="Retrieved source will appear here when the BIS knowledge system is connected."
                                            />
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

    const handleSend = () => {
        if (!message.trim()) return;

        console.log("Message:", message);
        setMessage("");
    };

    return (
        <div className="flex w-full max-w-2xl gap-3">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about BIS standards..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={handleSend}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
                Send
            </button>
        </div>
    );
}

export default ChatWindow;
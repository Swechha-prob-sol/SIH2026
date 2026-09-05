import { useState } from "react";
import SourceCard from "./SourceCard";
import { useLanguage } from "../context/LanguageContext";

function ChatWindow() {
    const { t } = useLanguage();
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

                assistantContent = bestMatch.text || `${t.relevantStandardFound} ${bestMatch.title || bestMatch.standard_number}`;

                sourcesList = data.results.map((item: { standard_number?: string; standard_id?: string; title?: string; text?: string; score?: number }) => ({
                    title: `${item.standard_number || item.standard_id || t.bisStandardFallback} - ${item.title || t.indianStandardFallback}`,
                    description: item.text ? (item.text.length > 150 ? item.text.substring(0, 150) + "..." : item.text) : `${t.matchScore} ${((item.score ?? 0) * 100).toFixed(1)}%`,
                }));
            } else {
                assistantContent = t.noResultsFound;
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
                    content: t.serverConnectionError,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-[#f5f7fa] transition-colors duration-150 dark:bg-slate-950">

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">

                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-900 text-xl font-bold text-white shadow-sm dark:bg-blue-600">
                            BIS
                        </div>

                        <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            {t.welcomeTitle}
                        </h2>

                        <p className="mt-2 max-w-lg text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {t.welcomeDescription}
                        </p>

                        {/* Quick actions */}
                        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">

                            <button
                                onClick={() => setMessage(t.actionFindPrompt)}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/50 dark:hover:bg-slate-850 dark:hover:shadow-lg dark:hover:shadow-slate-950/50"
                            >
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {t.actionFindTitle}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {t.actionFindDesc}
                                </p>
                            </button>

                            <button
                                onClick={() => setMessage(t.actionCompliancePrompt)}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/50 dark:hover:bg-slate-850 dark:hover:shadow-lg dark:hover:shadow-slate-950/50"
                            >
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {t.actionComplianceTitle}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {t.actionComplianceDesc}
                                </p>
                            </button>

                            <button
                                onClick={() => setMessage(t.actionExplainPrompt)}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/50 dark:hover:bg-slate-850 dark:hover:shadow-lg dark:hover:shadow-slate-950/50"
                            >
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {t.actionExplainTitle}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                    {t.actionExplainDesc}
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
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-xs ${msg.role === "user"
                                        ? "rounded-br-md bg-blue-900 text-white dark:bg-blue-600"
                                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                        }`}
                                >
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                        {msg.role === "user" ? t.userRole : t.assistantRole}
                                    </div>

                                    <div>{msg.content}</div>

                                    {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
                                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                                                {t.retrievedSources} ({msg.sources.length})
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
                                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                    <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-400">
                                        {t.assistantRole}
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 dark:bg-slate-500"></span>
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms] dark:bg-slate-500"></span>
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms] dark:bg-slate-500"></span>

                                        <span className="ml-1 text-xs text-slate-400 dark:text-slate-400">
                                            {t.thinking}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900">

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto flex max-w-4xl items-center gap-3 rounded-xl border border-slate-300 bg-white p-2 shadow-xs transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-900/30"
                >

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.inputPlaceholder}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                    />

                    <button
                        type="submit"
                        className="rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:opacity-40"
                        disabled={!message.trim()}
                    >
                        {t.askButton}
                    </button>

                </form>

                <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-slate-400 dark:text-slate-500">
                    {t.disclaimer}
                </p>

            </div>
        </div>
    );
}

export default ChatWindow;
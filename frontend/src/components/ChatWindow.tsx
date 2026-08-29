import { useState } from "react";

function ChatWindow() {
    const [message, setMessage] = useState("");

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
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Send, X } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InterviewModalProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "starting" | "streaming" | "summarising" | "done";

export function InterviewModal({ projectId, open, onClose }: InterviewModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [input, setInput] = useState("");
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start session when modal opens
  useEffect(() => {
    if (!open || sessionId) return;

    setStatus("starting");
    fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to start interview");
        return r.json();
      })
      .then((data) => {
        setSessionId(data.session_id);
        setMessages([{ role: "model", content: data.first_message, ts: new Date().toISOString() }]);
        setStatus("idle");
      })
      .catch(() => {
        setStreamError("Failed to start interview. Please close and try again.");
        setStatus("idle");
      });
  }, [open, projectId, sessionId]);

  // Reset on close
  function handleClose() {
    setSessionId(null);
    setMessages([]);
    setStreamingContent("");
    setInput("");
    setStatus("idle");
    setConfirmFinish(false);
    setStreamError(null);
    onClose();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  async function sendMessage() {
    if (!input.trim() || !sessionId || status === "streaming") return;

    const userMsg: ChatMessage = { role: "user", content: input.trim(), ts: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStatus("streaming");
    setStreamingContent("");
    setStreamError(null);

    try {
      const res = await fetch(`/api/interview/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMsg.content }),
      });

      if (!res.ok || !res.body) {
        setStreamError("Failed to reach the AI. Please try again.");
        setStatus("idle");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";
      let gotDone = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload === "[DONE]") {
            setMessages((prev) => [
              ...prev,
              { role: "model", content: assembled, ts: new Date().toISOString() },
            ]);
            setStreamingContent("");
            setStatus("idle");
            gotDone = true;
            break;
          }
          try {
            const chunk = JSON.parse(payload);
            if (typeof chunk === "string") {
              assembled += chunk;
              setStreamingContent(assembled);
            } else if (chunk && typeof chunk === "object" && "error" in chunk) {
              const raw = chunk.error as string;
              let msg = "AI error. Please try again.";
              try {
                const inner = JSON.parse(raw);
                if (inner?.error?.code === 429) msg = "Gemini rate limit reached — please wait a moment and try again.";
                else if (inner?.error?.message) msg = inner.error.message.slice(0, 120);
              } catch { /* raw wasn't JSON */ }
              setStreamingContent("");
              setStreamError(msg);
              setStatus("idle");
              gotDone = true;
              break;
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
        if (gotDone) break;
      }

      if (!gotDone) {
        setStreamingContent("");
        setStreamError("Connection dropped. Please try again.");
        setStatus("idle");
      }
    } catch {
      setStreamingContent("");
      setStreamError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  async function finishInterview() {
    if (!sessionId) return;
    setConfirmFinish(false);
    setStatus("summarising");

    const res = await fetch(`/api/interview/${sessionId}/summary`, { method: "POST" });
    if (res.ok) {
      setStatus("done");
      setTimeout(() => {
        handleClose();
        router.refresh();
      }, 1500);
    } else {
      setStatus("idle");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const allMessages = [...messages];
  if (streamingContent) {
    allMessages.push({ role: "model", content: streamingContent, ts: "" });
  }

  return (
    <Modal open={open} onClose={handleClose} className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">AI Interview</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Answer freely — I&apos;ll help you develop your idea
          </p>
        </div>
        <button onClick={handleClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ minHeight: 300, maxHeight: 420 }}>
        {status === "starting" && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}
        {allMessages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200",
                i === allMessages.length - 1 && streamingContent && msg.role === "model"
                  ? "after:ml-0.5 after:inline-block after:h-3.5 after:w-0.5 after:animate-pulse after:bg-current after:align-middle"
                  : ""
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {streamError && (
          <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-center text-sm text-red-600 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
            {streamError}
          </p>
        )}
        {status === "summarising" && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-zinc-500">
            <Spinner className="h-4 w-4" />
            Generating your project summary…
          </div>
        )}
        {status === "done" && (
          <p className="text-center text-sm text-green-600 dark:text-green-400 font-medium py-2">
            Summary saved! Closing…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {status !== "summarising" && status !== "done" && (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-700">
          {confirmFinish ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 dark:bg-amber-950/30 dark:border-amber-800">
              <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
                Generate a summary from this conversation?
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={finishInterview}>
                  Yes, generate summary
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmFinish(false)}>
                  Keep chatting
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === "streaming" || status === "starting"}
                placeholder="Type your answer… (Enter to send)"
                rows={2}
                className="flex-1 resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || status === "streaming" || status === "starting"}
                  size="sm"
                  className="h-9"
                >
                  {status === "streaming" ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 text-xs"
                  disabled={messages.length < 3}
                  onClick={() => setConfirmFinish(true)}
                >
                  Finish
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import type { AgentReply, ChatMessage, TraceEvent } from "../_lib/demo-agent";

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

type SpeechRecognitionErrorEventLike = {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type DisplayMessage = ChatMessage & {
  id: string;
  trace?: TraceEvent[];
  route?: AgentReply["route"];
};

const starters = [
  "Show me vegan options",
  "What is under $300?",
  "Track order ORD-203",
  "Pizza options and track ORD-202",
];

const greeting: DisplayMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I can recommend dishes or check an order. Try speaking, typing, or choosing a prompt below.",
};

function Icon({ name }: { name: "mic" | "send" | "sound" | "mute" | "spark" }) {
  const paths = {
    mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    sound: <><path d="M11 5 6 9H2v6h4l5 4Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></>,
    mute: <><path d="M11 5 6 9H2v6h4l5 4Z" /><path d="m22 9-6 6M16 9l6 6" /></>,
    spark: <><path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export function AgentConsole() {
  const [messages, setMessages] = useState<DisplayMessage[]>([greeting]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSpeechSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  function speak(text: string) {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/\$(\d+(?:\.\d+)?)/g, "$1 dollars"));
    utterance.rate = 1.02;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(content: string) {
    const clean = content.trim();
    if (!clean || isSending) return;

    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", content: clean };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content: messageContent }) => ({ role, content: messageContent })) }),
      });
      if (!response.ok) throw new Error("The agent could not answer right now.");
      const reply = (await response.json()) as AgentReply;
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: reply.answer, trace: reply.trace, route: reply.route },
      ]);
      speak(reply.answer);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The agent could not answer right now.");
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function toggleListening() {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
      if (transcript) void sendMessage(transcript);
    };
    recognition.onerror = (event) => {
      if (event.error !== "aborted") setError("I couldn't hear that. Please try again or type your request.");
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setError("");
    setIsListening(true);
    recognition.start();
  }

  return (
    <div className="agent-console">
      <div className="agent-sidebar">
        <div>
          <span className="console-kicker">Live playground</span>
          <h3>Talk to SnackStack</h3>
          <p>Explore the same route → tool → answer loop learners build in the lab.</p>
        </div>
        <div className="console-capabilities">
          <div><span>01</span><p><strong>Ask naturally</strong>Use voice or text.</p></div>
          <div><span>02</span><p><strong>Get grounded answers</strong>Menu and order data only.</p></div>
          <div><span>03</span><p><strong>Inspect the route</strong>Open evidence under replies.</p></div>
        </div>
        <div className="demo-note"><Icon name="spark" /><span><strong>Safe demo mode</strong>No API key or model spend.</span></div>
      </div>

      <div className="chat-shell">
        <div className="chat-header">
          <div className="agent-identity">
            <span className="agent-avatar"><Icon name="spark" /></span>
            <span><strong>SnackStack Agent</strong><small><i /> Online · grounded demo</small></span>
          </div>
          <button
            className="sound-toggle"
            type="button"
            onClick={() => {
              setSpeechEnabled((enabled) => !enabled);
              window.speechSynthesis?.cancel();
            }}
            aria-label={speechEnabled ? "Mute spoken answers" : "Enable spoken answers"}
            title={speechEnabled ? "Spoken answers on" : "Spoken answers off"}
          >
            <Icon name={speechEnabled ? "sound" : "mute"} />
          </button>
        </div>

        <div className="message-stream" ref={scrollRef} aria-live="polite">
          {messages.map((message) => (
            <div className={`message-row ${message.role}`} key={message.id}>
              {message.role === "assistant" && <span className="message-avatar">S</span>}
              <div className="message-content">
                <div className="message-bubble">{message.content}</div>
                {message.trace && (
                  <details className="reply-trace">
                    <summary><span>{message.route}</span> View agent evidence</summary>
                    <div>
                      {message.trace.map((event, index) => (
                        <p key={`${event.label}-${index}`}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{event.label}</strong>{event.detail}</span></p>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="message-row assistant">
              <span className="message-avatar">S</span>
              <div className="thinking-bubble" aria-label="Agent is thinking"><i /><i /><i /></div>
            </div>
          )}
        </div>

        <div className="starter-row" aria-label="Suggested prompts">
          {starters.map((starter) => <button type="button" key={starter} onClick={() => void sendMessage(starter)}>{starter}</button>)}
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <button
            className={`mic-button ${isListening ? "listening" : ""}`}
            type="button"
            onClick={toggleListening}
            disabled={!speechSupported || isSending}
            aria-label={isListening ? "Stop listening" : "Speak your request"}
            title={speechSupported ? "Speak your request" : "Voice input is not supported in this browser"}
          >
            <Icon name="mic" />
            {isListening && <span className="mic-pulse" />}
          </button>
          <label>
            <span className="sr-only">Message SnackStack</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isListening ? "Listening…" : "Ask about the menu or an order…"}
              disabled={isSending}
            />
          </label>
          <button className="send-button" type="submit" disabled={!input.trim() || isSending} aria-label="Send message"><Icon name="send" /></button>
        </form>
        {error && <p className="chat-error" role="alert">{error}</p>}
        <p className="voice-help">{speechSupported ? "Tap the mic and allow browser microphone access." : "Voice input needs Chrome, Edge, or Safari. Typing still works."}</p>
      </div>
    </div>
  );
}

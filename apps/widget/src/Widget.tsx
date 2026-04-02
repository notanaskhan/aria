import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface WidgetConfig {
  employeeId: string;
  tenantKey: string;
  apiBaseUrl?: string;
  primaryColor?: string;
  greeting?: string;
  placeholder?: string;
  employeeName?: string;
}

declare global {
  interface Window {
    AriaWidget?: WidgetConfig;
  }
}

export function Widget({ config }: { config: WidgetConfig }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiBase = config.apiBaseUrl ?? "https://api.aria.ai";
  const primaryColor = config.primaryColor ?? "#6366F1";
  const employeeName = config.employeeName ?? "Aria";
  const greeting = config.greeting ?? `Hi! I'm ${employeeName}. How can I help you today?`;

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: greeting }]);
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    const assistantIdx = messages.length + 1;
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

    try {
      const resp = await fetch(`${apiBase}/api/v1/chat/${config.employeeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userText, session_id: sessionId }),
      });

      if (!resp.ok) throw new Error("Request failed");

      const reader = resp.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "token") {
              accumulated += event.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: accumulated,
                  streaming: true,
                };
                return updated;
              });
            } else if (event.type === "escalation") {
              accumulated = "I'm connecting you with a human agent who can help better. One moment...";
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            } else if (event.type === "done") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "360px",
            maxHeight: "520px",
            background: "#08080F",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            zIndex: 999999,
            fontFamily: "Inter, system-ui, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${primaryColor}, #3B82F6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                {employeeName[0]}
              </div>
              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: 600, margin: 0 }}>
                  {employeeName}
                </p>
                <p style={{ color: "#10B981", fontSize: "11px", margin: 0 }}>● Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94A3B8",
                padding: "4px",
                borderRadius: "6px",
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "8px",
                      background: `linear-gradient(135deg, ${primaryColor}, #3B82F6)`,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                      fontWeight: "bold",
                      marginTop: "2px",
                    }}
                  >
                    {employeeName[0]}
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "10px 13px",
                    borderRadius: msg.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                    background:
                      msg.role === "user"
                        ? "rgba(255,255,255,0.08)"
                        : `${primaryColor}18`,
                    border: msg.role === "assistant" ? `1px solid ${primaryColor}30` : "none",
                    color: msg.role === "user" ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.9)",
                    fontSize: "13px",
                    lineHeight: "1.5",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                  {msg.streaming && msg.content === "" && (
                    <span style={{ display: "inline-flex", gap: "3px", alignItems: "center" }}>
                      {[0, 200, 400].map((delay) => (
                        <span
                          key={delay}
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: primaryColor,
                            display: "inline-block",
                            animation: `bounce 1.4s ease-in-out ${delay}ms infinite`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "8px 12px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder={config.placeholder ?? "Type a message..."}
                disabled={isLoading}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "white",
                  fontSize: "13px",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: input.trim()
                    ? `linear-gradient(135deg, ${primaryColor}, #3B82F6)`
                    : "rgba(255,255,255,0.08)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                <ArrowRight size={13} color="white" />
              </button>
            </div>
            <p style={{ textAlign: "center", color: "#94A3B8", fontSize: "10px", marginTop: "8px" }}>
              Powered by <span style={{ color: primaryColor }}>Aria</span>
            </p>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${primaryColor}, #3B82F6)`,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 20px ${primaryColor}40`,
          zIndex: 999999,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        {open ? <X size={20} color="white" /> : <MessageCircle size={20} color="white" />}
      </button>
    </>
  );
}

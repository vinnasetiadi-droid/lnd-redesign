"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Send,
  Sparkles,
  Mic,
  MicOff,
  ChevronDown,
  Minimize2,
  Search,
  Check,
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { listLanguage } from "../../../imports/pasted_text/language-list";
import { useRef, useEffect, useState, useMemo } from "react";
import { cn } from "../../../lib/utils";
import { AssistantContent } from "./data";
import MarkdownRenderer from "../atoms/MarkdownRenderer";
import { useSocketAssistant } from "../../../providers/SocketAssistantProvider";
import { useRecorder } from "../../../imports/pasted_text/mic-recorder";

interface DialogNisaProps {
  isOpen: boolean;
  onClose: () => void;
  content: AssistantContent;
}

export default function DialogNisa({
  isOpen,
  onClose,
  content,
}: DialogNisaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  // Consume Socket Assistant Context (already connected at app level)
  const {
    isConnected,
    messages,
    streamingMessage,
    aiState,
    suggestions,
    selectedLanguage,
    setSelectedLanguage,
    rejoinWithLanguage,
    sendTextInput,
    sendAudioInput,
  } = useSocketAssistant();

  // Local UI state
  const [isChatMode, setIsChatMode] = useState(false);
  const [message, setMessage] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Streaming Audio Recorder (real-time chunks to socket)
  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recorderError,
  } = useRecorder({
    sampleRate: 16000,
    bufferSize: 2048, // ~128ms chunks (closest to 100ms requirement)
    onDataAvailable: (buffer) => {
      // Stream PCM chunks to socket in real-time
      console.log(
        `[DialogNisa] 🎤 Sending audio chunk: ${buffer.byteLength} bytes`,
      );
      sendAudioInput(buffer);
    },
    onStart: () => {
      console.log(
        "🎤 [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      console.log(
        "🎤 [DialogNisa] Recording started - streaming to socket",
      );
      console.log(
        "🎤 [DialogNisa] Buffer size: 2048 samples (~128ms)",
      );
      console.log("🎤 [DialogNisa] Sample rate: 16000 Hz");
      console.log(
        "🎤 [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
    },
    onStop: () => {
      console.log(
        "🎤 [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      console.log("🎤 [DialogNisa] Recording stopped");
      console.log(
        "🎤 [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
    },
    onError: (error) => {
      console.log(
        "❌ [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
      console.log(
        "❌ [DialogNisa] Recording error:",
        error.message,
      );
      console.log(
        "❌ [DialogNisa] ━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      );
    },
  });

  // Show error toast if recorder has error
  useEffect(() => {
    if (recorderError) {
      console.error(
        `[DialogNisa] Recorder error: ${recorderError}`,
      );
      // You can add toast notification here if you have toast library
    }
  }, [recorderError]);

  // ✅ AUTO-STOP recording when AI state changes to "thinking"
  // This means STT has finished processing user's voice input
  useEffect(() => {
    if (aiState === "thinking" && isRecording) {
      console.log(
        "[DialogNisa] 🎤 Auto-stopping recording - assistant is thinking",
      );
      stopRecording();
      setIsChatMode(true); // Switch to chat mode to show transcript
    }
  }, [aiState, isRecording, stopRecording]);

  // Flag emoji helper
  const getFlagEmoji = (langValue: string) => {
    try {
      const parts = langValue.split("-");
      const countryCode = parts[parts.length - 1];
      if (!countryCode || countryCode.length !== 2) return "🌐";
      return countryCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397),
        );
    } catch {
      return "🌐";
    }
  };

  // Filtered languages
  const filteredLanguages = useMemo(() => {
    if (!languageSearch.trim()) return listLanguage;
    return listLanguage.filter((lang) =>
      lang.key
        .toLowerCase()
        .includes(languageSearch.toLowerCase()),
    );
  }, [languageSearch]);

  // Auto scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, streamingMessage]);

  // Handle feature click
  const handleFeatureClick = (query: string) => {
    setIsChatMode(true);
    setTimeout(() => {
      sendTextInput(query);
    }, 100);
  };

  // Handle text input submit
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    sendTextInput(message);
    setIsChatMode(true);

    setMessage("");
    if (messageRef.current) {
      messageRef.current.blur();
      messageRef.current.value = "";
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestionMessage: string) => {
    sendTextInput(suggestionMessage);
    setIsChatMode(true);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage(e);
    }
  };

  // Handle mic button (toggle streaming recording)
  const handleMicButton = async () => {
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    console.log("[DialogNisa] 🎤 Mic button clicked!");
    console.log("[DialogNisa] isOpen:", isOpen);
    console.log("[DialogNisa] isConnected:", isConnected);
    console.log("[DialogNisa] isRecording:", isRecording);
    console.log(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );

    if (!isOpen || !isConnected) {
      console.log(
        "[DialogNisa] ❌ Cannot start recording - dialog closed or not connected",
      );
      return;
    }

    if (isRecording) {
      console.log(
        "🎤 [DialogNisa] Stopping streaming recorder...",
      );
      stopRecording();
    } else {
      console.log(
        "🎤 [DialogNisa] Starting streaming recorder...",
      );
      try {
        await startRecording();
        console.log(
          "🎤 [DialogNisa] startRecording() called successfully",
        );
      } catch (error) {
        console.error(
          "❌ [DialogNisa] Failed to start recording:",
          error,
        );
      }
    }
  };

  // Helper for chat placeholder
  const getInputPlaceholder = (role: string) => {
    switch (role) {
      case "pimpinan":
        return "Ask strategic questions or give commands...";
      case "instruktur":
        return "Ask about classes or students...";
      case "admin":
        return "Type system commands...";
      default:
        return "Type your message here...";
    }
  };

  // All messages are now in the messages array (streaming messages are updated in place)
  const allMessages = messages;

  // Is typing indicator - only show when "thinking" and no partial message streaming
  const hasPartialMessage = messages.some(
    (msg) => !msg.is_final,
  );
  const isTyping = aiState === "thinking" && !hasPartialMessage;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-[#0A0D12]/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 z-[9980]" />

        {/* Content (Modal Panel) */}
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none w-[95vw] h-[90vh] md:w-[85vw] md:h-[85vh] lg:w-[80vw] lg:max-w-[1280px] lg:h-[80vh] lg:max-h-[900px] rounded-[24px] overflow-hidden shadow-2xl z-[9998] border border-[#E9EAEB] bg-white flex flex-col">
          {/* Light Theme Background Pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "radial-gradient(ellipse 75% 68% at 108% 0%, rgba(178, 196, 252, 0.88) 0%, transparent 100%)",
                "radial-gradient(ellipse 75% 68% at 108% 100%, rgba(106, 220, 210, 0.84) 0%, transparent 100%)",
                "#ffffff",
              ].join(", "),
            }}
          />

          <Dialog.Title hidden>
            {content.welcomeTitle}
          </Dialog.Title>
          <Dialog.Description hidden>
            Dialog asisten Nisa untuk {content.role}
          </Dialog.Description>

          <div className="w-full h-full flex flex-col p-6 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 shrink-0">
              {/* Language Selector */}
              <Popover.Root
                open={isLangOpen}
                onOpenChange={setIsLangOpen}
              >
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#00000008] border border-transparent text-sm text-[#414651] font-medium transition-colors hover:bg-[#0000000c] outline-none">
                    <span className="text-base leading-none">
                      {getFlagEmoji(selectedLanguage.value)}
                    </span>
                    {selectedLanguage.key.split(" (")[0]}
                    <ChevronDown className="w-4 h-4 text-[#717680] ml-1" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="start"
                    sideOffset={8}
                    className="z-[10000] w-[260px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-lg overflow-hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
                  >
                    {/* Search Input */}
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E9EAEB]">
                      <Search className="w-4 h-4 text-[#A4A7AE]" />
                      <input
                        type="text"
                        placeholder="Search language..."
                        value={languageSearch}
                        onChange={(e) =>
                          setLanguageSearch(e.target.value)
                        }
                        className="flex-1 bg-transparent text-sm text-[#252B37] placeholder:text-[#A4A7AE] outline-none"
                        autoFocus
                      />
                    </div>
                    {/* List */}
                    <div className="max-h-[280px] overflow-y-auto py-1 custom-scrollbar">
                      {filteredLanguages.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-[#717680] text-center">
                          No language found.
                        </div>
                      ) : (
                        filteredLanguages.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => {
                              rejoinWithLanguage(lang);
                              setIsLangOpen(false);
                              setLanguageSearch("");
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors",
                              selectedLanguage.value ===
                                lang.value
                                ? "bg-[#F5FAFF] text-[#1570EF] font-medium"
                                : "text-[#414651] hover:bg-[#FAFAFA]",
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-base">
                                {getFlagEmoji(lang.value)}
                              </span>
                              {lang.key}
                            </span>
                            {selectedLanguage.value ===
                              lang.value && (
                              <Check className="w-4 h-4 text-[#1570EF]" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Connection Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#00000008] border border-transparent">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      isConnected
                        ? "bg-[#039855] animate-pulse"
                        : "bg-[#F04438]",
                    )}
                  />
                  <span className="text-xs text-[#717680]">
                    {isConnected
                      ? "Connected"
                      : "Connecting..."}
                  </span>
                </div>

                <Dialog.Close asChild>
                  <button className="p-2.5 text-[#414651] bg-[#00000008] hover:bg-[#0000000c] rounded-[12px] transition-colors border border-transparent">
                    <Minimize2 className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col min-h-0 relative">
              {!isChatMode || allMessages.length === 0 ? (
                /* Empty State / Welcome Screen */
                <div className="flex flex-col flex-1 overflow-y-auto w-full max-w-[85%] mx-auto px-4 pt-12 pb-32">
                  <div className="text-center mb-16">
                    <p className="text-[#535862] text-sm mb-4">
                      Hi there
                    </p>
                    <h2 className="text-[32px] font-semibold text-[#181D27] mb-4 tracking-tight">
                      Ready to explore something new today?
                    </h2>
                    <p className="text-[#717680] text-sm">
                      Just click the mic or type to begin!
                    </p>
                  </div>

                  {/* Quick Suggestions Cards */}
                  <div className="w-full mb-16">
                    <h3 className="text-sm font-semibold text-[#181D27] mb-4 text-left">
                      Quick Suggestions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {suggestions.length > 0
                        ? suggestions
                            .slice(0, 3)
                            .map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  handleFeatureClick(suggestion)
                                }
                                className="flex flex-col items-start p-5 bg-[#0A0D12]/[0.04] border border-[#0A0D12]/[0.08] rounded-[12px] hover:bg-[#0A0D12]/[0.06] hover:border-[#0A0D12]/[0.12] hover:shadow-[0_4px_12px_rgba(10,13,18,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-left min-h-[90px] cursor-pointer"
                              >
                                <p className="text-[#535862] text-[15px] leading-relaxed">
                                  {suggestion}
                                </p>
                              </button>
                            ))
                        : // Fallback to static content while loading
                          content.features
                            .slice(0, 3)
                            .map((feature, index) => (
                              <button
                                key={index}
                                onClick={() =>
                                  feature.query &&
                                  handleFeatureClick(
                                    feature.query,
                                  )
                                }
                                className="flex flex-col items-start p-5 bg-[#0A0D12]/[0.04] border border-[#0A0D12]/[0.08] rounded-[12px] hover:bg-[#0A0D12]/[0.06] hover:border-[#0A0D12]/[0.12] hover:shadow-[0_4px_12px_rgba(10,13,18,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-left min-h-[90px] cursor-pointer"
                              >
                                <p className="text-[#535862] text-[15px] leading-relaxed">
                                  {feature.description ||
                                    feature.title}
                                </p>
                              </button>
                            ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Chat Messages */
                <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 w-full max-w-[85%] mx-auto px-4 pb-32">
                  {allMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1.5",
                        msg.sender === "user"
                          ? "items-end"
                          : "items-start",
                      )}
                    >
                      {msg.sender === "nisa" && (
                        <div className="flex items-center gap-2 mb-1 ml-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1570EF] to-[#2E90FA] flex items-center justify-center text-white shadow-sm">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-[#414651]">
                            Nisa
                          </span>
                        </div>
                      )}

                      <div
                        className={cn(
                          "max-w-[85%] md:max-w-[75%] px-4 py-3 text-sm leading-relaxed",
                          msg.sender === "user"
                            ? "bg-[#1570EF] text-white rounded-[16px] rounded-tr-[4px] shadow-sm"
                            : "bg-[#00000008] text-[#414651] border border-transparent rounded-[16px] rounded-tl-[4px] shadow-sm",
                        )}
                      >
                        {msg.sender === "nisa" ? (
                          <MarkdownRenderer
                            content={msg.text}
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        )}
                      </div>

                      <span
                        className={cn(
                          "text-[10px] text-[#A4A7AE] px-1",
                          msg.sender === "user"
                            ? "text-right"
                            : "text-left",
                        )}
                      >
                        {msg.timestamp.toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>

                      {/* Suggestions */}
                      {msg.sender === "nisa" &&
                        msg.suggestions &&
                        msg.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2 max-w-[85%]">
                            {msg.suggestions.map(
                              (suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() =>
                                    handleSuggestionClick(
                                      suggestion,
                                    )
                                  }
                                  className="text-xs bg-white text-[#414651] border border-[#E9EAEB] hover:border-[#1570EF] hover:text-[#1570EF] px-3 py-1.5 rounded-full transition-all text-left shadow-sm"
                                >
                                  {suggestion}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && !streamingMessage && (
                    <div className="flex justify-start">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-2 mb-1 ml-1">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1570EF] to-[#2E90FA] flex items-center justify-center text-white shadow-sm">
                            <Sparkles className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-semibold text-[#414651]">
                            Nisa
                          </span>
                        </div>
                        <div className="bg-[#00000008] border border-transparent rounded-[16px] rounded-tl-[4px] px-4 py-3 shadow-sm">
                          <div className="flex gap-1.5 items-center h-5">
                            <div
                              className="w-1.5 h-1.5 bg-[#A4A7AE] rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="w-1.5 h-1.5 bg-[#A4A7AE] rounded-full animate-bounce"
                              style={{
                                animationDelay: "150ms",
                              }}
                            />
                            <div
                              className="w-1.5 h-1.5 bg-[#A4A7AE] rounded-full animate-bounce"
                              style={{
                                animationDelay: "300ms",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Fixed Input Area - Always visible, positioned above mic button */}
              <div className="absolute bottom-[140px] left-0 right-0 flex justify-center pointer-events-none z-10">
                <div className="w-full max-w-[85%] mx-auto px-4 pointer-events-auto">
                  <form
                    className="w-full relative flex items-center border-b border-[#E9EAEB] pb-2"
                    onSubmit={handleSubmitMessage}
                  >
                    <input
                      ref={messageRef}
                      type="text"
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                      placeholder={getInputPlaceholder(
                        content.role,
                      )}
                      className="flex-1 bg-transparent text-[#252B37] placeholder:text-[#A4A7AE] outline-none text-sm h-8"
                    />
                    {message.trim() && (
                      <button
                        type="submit"
                        disabled={
                          !message.trim()
                        }
                        className="p-1 text-[#1570EF] hover:text-[#175CD3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>
              </div>

              {/* The Bottom Glowing Mic Area (absolute positioned to overlap at bottom center) */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 pointer-events-none z-20">
                {/* Background wave effect approximation */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-gradient-to-t from-[#B2C4FC]/50 via-[#6ADCD2]/30 to-transparent blur-3xl -z-10" />

                {/* Mic Button Container */}
                <div className="relative pointer-events-auto mt-4">
                  {/* Outer glow orb */}
                  <div className="absolute inset-[-16px] rounded-full bg-gradient-to-tr from-[#6ADCD2] to-[#B2C4FC] opacity-40 blur-2xl animate-pulse" />

                  {/* Actual button */}
                  <button
                    onClick={handleMicButton}
                    disabled={!isConnected}
                    className={cn(
                      "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative shadow-[0_12px_40px_rgba(59,130,246,0.3)] backdrop-blur-xl border border-white/60",
                      isRecording
                        ? "bg-red-500/80 text-white border-red-400"
                        : "bg-[radial-gradient(110%_110%_at_50%_10%,_rgba(106,220,210,0.8)_0%,_rgba(59,130,246,0.8)_50%,_rgba(178,196,252,0.8)_100%)] text-white",
                    )}
                  >
                    {/* Inner highlight for glass effect */}
                    <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/40 to-transparent z-0 pointer-events-none" />

                    {/* Icon */}
                    <div className="relative z-10">
                      {isRecording ? (
                        <MicOff className="w-10 h-10 text-white drop-shadow-lg animate-pulse" />
                      ) : (
                        <Mic className="w-10 h-10 text-white drop-shadow-lg" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChatMessage, ChatOption } from "@/types/chat";
import { conversationFlow, conversationFlowEN, WHATSAPP_LINK, CONTACT_LINK, JOBS_LINK, WEBSITE_LINK, BOT_TYPING_DELAY } from "@/data/chatbotData";
import { trackContacto } from "@/lib/tracking";

export const useChatbot = () => {
  const { i18n } = useTranslation();
  const flow = i18n.language === "en" ? conversationFlowEN : conversationFlow;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ChatOption[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addBotMessage = useCallback((content: string, options?: ChatOption[]) => {
    const newMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
      options,
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentOptions(options || []);
  }, []);

  const addUserMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setCurrentOptions([]);
  }, []);

  const handleOptionClick = useCallback((option: ChatOption) => {
    // Handle external links
    if (option.action === "open_whatsapp") {
      trackContacto("whatsapp", "chatbot");
      window.open(WHATSAPP_LINK, "_blank");
      return;
    }
    if (option.action === "open_contact") {
      window.location.href = CONTACT_LINK;
      return;
    }
    if (option.action === "open_jobs") {
      window.location.href = JOBS_LINK;
      return;
    }
    if (option.action === "open_website") {
      window.location.href = WEBSITE_LINK;
      return;
    }

    addUserMessage(option.label);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const step = flow[option.action];
      if (step) {
        addBotMessage(step.message, step.options);
      }
    }, BOT_TYPING_DELAY);
  }, [addUserMessage, addBotMessage, flow]);

  const initializeChat = useCallback(() => {
    setMessages([]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const initial = flow.initial;
      addBotMessage(initial.message, initial.options);
    }, BOT_TYPING_DELAY);
  }, [addBotMessage, flow]);

  const resetChat = useCallback(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  return {
    messages,
    isTyping,
    currentOptions,
    messagesEndRef,
    handleOptionClick,
    initializeChat,
    resetChat,
  };
};

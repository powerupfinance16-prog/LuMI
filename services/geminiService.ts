import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

// Initialize the API client
// Ideally this should be outside the component to avoid re-initialization, 
// but we need to ensure process.env is available.
const createAIClient = () => {
  try {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI", error);
    return null;
  }
};

const SYSTEM_INSTRUCTION = `You are Lumi, a warm, empathetic, and intelligent AI companion. 
Your goal is to be a supportive friend who is great at listening, offering advice when asked, and discussing interesting topics.
- Be conversational and natural. Avoid overly robotic phrasing.
- Use emojis occasionally to convey emotion, but don't overdo it.
- Keep responses concise and easy to read, unless the user asks for a detailed explanation.
- If the user is sad, be comforting. If they are happy, celebrate with them.
- You have a touch of wit and humor.
`;

export const useGeminiChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Hi there! I'm Lumi. 👋 I'm here to chat, listen, or just hang out. How are you feeling today?",
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  // Initialize Chat Session
  useEffect(() => {
    aiRef.current = createAIClient();
    if (aiRef.current) {
      startNewSession();
    }
  }, []);

  const startNewSession = () => {
    if (!aiRef.current) return;
    
    try {
      chatSessionRef.current = aiRef.current.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.9, // Higher temperature for more creative/friendly responses
          topP: 0.95,
        },
      });
    } catch (e) {
      console.error("Failed to start chat session", e);
    }
  };

  const resetChat = useCallback(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: "I've cleared our memory. Let's start fresh! What's on your mind?",
      timestamp: new Date(),
    }]);
    startNewSession();
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatSessionRef.current) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a placeholder for the model response
      const responseId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: responseId,
          role: 'model',
          text: '', // Start empty for streaming
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      const result = await chatSessionRef.current.sendMessageStream({ message: text });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const chunkText = (chunk as GenerateContentResponse).text;
        if (chunkText) {
          fullText += chunkText;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === responseId 
                ? { ...msg, text: fullText } 
                : msg
            )
          );
        }
      }

      // Finish streaming
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === responseId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'model',
          text: "I'm having a little trouble connecting right now. Can we try that again?",
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    messages,
    sendMessage,
    isLoading,
    resetChat
  };
};

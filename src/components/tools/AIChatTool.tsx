import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Loader2, Mic, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIResponse } from '../../services/ai/chat';
import { aiManager } from '../../services/ai/AIManager';
import { ChatThemeProvider, useTheme } from './chat/ChatThemeProvider';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import type {
  ChatMessage as ChatMessageType,
  ChatSession,
  QuickReply,
  ChatResponse,
  Alert
} from '../../types/chat';
import { QUICK_REPLIES } from '../../types/chat';
import '../../types/speech';

interface AIChatToolProps {
  defaultCancerType?: string;
  onEmergencyAlert?: (alert: Alert) => void;
  initialTheme?: 'light' | 'dark';
}

function AIChatToolContent({ defaultCancerType, onEmergencyAlert }: AIChatToolProps) {
  const { themeStyles } = useTheme();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [showFallbackNotice, setShowFallbackNotice] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognitionAPI();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;

      speechRecognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      speechRecognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError(`Speech recognition error: ${event.error}`);
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    const typingMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      typing: true
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setShowFallbackNotice(false);

    try {
      const response = await generateAIResponse({
        query: text,
        context: {
          cancerType: defaultCancerType,
          previousMessages: messages
        }
      });

      const aiMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        tokensUsed: response.tokensUsed,
        model: response.aiModel
      };

      setMessages(prev => [...prev.filter(m => !m.typing), aiMessage]);
      setActiveModel(response.aiModel);

      // Check if fallback was used
      const lastProvider = aiManager.getLastProvider();
      if (lastProvider === 'gemini' && response.aiModel.includes('gemini')) {
        setShowFallbackNotice(true);
      }

      // Handle emergency alerts
      if (response.alerts?.length) {
        response.alerts.forEach(alert => {
          if (alert.type === 'emergency' && onEmergencyAlert) {
            onEmergencyAlert(alert);
          }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate response');
      setMessages(prev => prev.filter(m => !m.typing));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (text: string) => {
    handleSend(text);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSend(reply.text);
  };

  const toggleVoiceInput = () => {
    if (!speechRecognition.current) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      speechRecognition.current.stop();
    } else {
      try {
        speechRecognition.current.start();
        setIsListening(true);
        setError(null);
      } catch (err) {
        console.error('Speech recognition error:', err);
        setError('Failed to start speech recognition');
        setIsListening(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center">
      <motion.div
        layout
        className={`rounded-lg shadow-lg transition-all duration-200 w-full h-full flex flex-col`}
      >
        <ChatHeader
          isExpanded={isExpanded}
          activeModel={activeModel}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
        />

        {/* Fallback Notice */}
        {showFallbackNotice && (
          <div className="px-4 py-2 bg-yellow-50 text-yellow-700 text-sm border-b">
            <AlertTriangle className="inline-block h-4 w-4 mr-1" />
            Switched to fallback model (Google Gemini) due to availability
          </div>
        )}

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${themeStyles.background}`}
          style={{ height: 'calc(100% - 140px)' }}
        >
          <AnimatePresence>
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                onFollowUpClick={handleFollowUpClick}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 0 && (
          <div className={`px-4 pb-2 ${themeStyles.background}`}>
            <div className={`text-sm font-medium ${themeStyles.text} mb-2`}>
              Quick Queries:
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className={`px-3 py-1 text-sm ${themeStyles.button.secondary} hover:bg-gray-200 rounded-full ${themeStyles.text}`}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50">
            <AlertTriangle className="inline-block h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        {/* Input Area */}
        <div className={`p-4 border-t ${themeStyles.border}`}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your query..."
              className={`flex-1 px-3 py-2 rounded-md ${themeStyles.input.background} ${themeStyles.input.text} ${themeStyles.input.border} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              disabled={isLoading}
            />
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-md ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : `${themeStyles.button.secondary} ${themeStyles.text}`
              } hover:bg-gray-200`}
              aria-label="Toggle voice input"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputValue.trim()}
              className={`p-2 ${themeStyles.button.primary} ${themeStyles.button.hover} rounded-md disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AIChatTool(props: AIChatToolProps) {
  return (
    <ChatThemeProvider initialTheme={props.initialTheme}>
      <AIChatToolContent {...props} />
    </ChatThemeProvider>
  );
}

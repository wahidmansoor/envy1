import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import { useTheme } from './ChatThemeProvider';
import type { ChatMessage, ChatResponse, Alert } from '../../../types/chat';

interface ChatMessageProps {
  message: ChatMessage;
  onFollowUpClick: (text: string) => void;
}

export default function ChatMessageComponent({ message, onFollowUpClick }: ChatMessageProps) {
  const { themeStyles } = useTheme();
  const isAI = message.role === 'assistant';
  const response = isAI ? message.content as ChatResponse : null;

  const renderStructuredContent = (content: any) => {
    if (!content) return null;

    if ('firstLine' in content) {
      // Treatment response
      return (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">First-line Treatment</h3>
            <ul className="list-disc pl-4 space-y-1">
              {content.firstLine.options.map((option: string, idx: number) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-1">
              Evidence: {content.firstLine.evidence.guideline} ({content.firstLine.evidence.level})
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Second-line Treatment</h3>
            <ul className="list-disc pl-4 space-y-1">
              {content.secondLine.options.map((option: string, idx: number) => (
                <li key={idx}>{option}</li>
              ))}
            </ul>
          </div>

          {content.redFlags && (
            <div className="bg-red-50 p-3 rounded-md">
              <h3 className="font-medium text-red-700 mb-2">Red Flags</h3>
              <ul className="list-disc pl-4 space-y-1 text-red-700">
                {content.redFlags.map((flag: string, idx: number) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    // Fallback to string representation
    return <p>{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</p>;
  };

  const renderAlert = (alert: Alert) => (
    <div
      className={`p-3 rounded-md ${
        alert.type === 'emergency' ? 'bg-red-50 text-red-700' :
        alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
        'bg-blue-50 text-blue-700'
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <p className="font-medium">{alert.message}</p>
      </div>
      {alert.action && (
        <ul className="mt-2 ml-6 list-disc">
          {alert.action.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg mb-4 ${
        isAI ? themeStyles.message.assistant : themeStyles.message.user
      }`}
    >
      {message.typing ? (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 bg-indigo-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-indigo-500 rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-indigo-500 rounded-full"
          />
        </div>
      ) : (
        <>
          {isAI && (
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
              <Zap className="h-4 w-4" />
              <span>Powered by {message.model}</span>
            </div>
          )}

          <div className={`prose prose-sm max-w-none ${isAI ? themeStyles.message.assistantText : themeStyles.message.userText}`}>
            {isAI ? (
              <div className="space-y-4">
                {response?.alerts?.map((alert, idx) => (
                  <div key={idx}>{renderAlert(alert)}</div>
                ))}
                
                {renderStructuredContent(response?.content)}

                {response?.references && (
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Guidelines: {response.references.guidelines.join(', ')}</p>
                    {response.references.citations.length > 0 && (
                      <p>Citations: {response.references.citations.join(', ')}</p>
                    )}
                  </div>
                )}

                {response?.followUpSuggestions && response.followUpSuggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Follow-up Questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {response.followUpSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => onFollowUpClick(suggestion)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors"
                        >
                          <ArrowRight className="h-3 w-3" />
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>{message.content as string}</p>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
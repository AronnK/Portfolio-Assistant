import { useState, useEffect } from 'react';
import { ChatbotService } from '@/lib/supabase/chatbot';
import { ChatbotData } from '@/app/types';

export function useChatbot(userId: string | null) {
  const [chatbots, setChatbots] = useState<ChatbotData[]>([]);
  const [primaryChatbot, setPrimaryChatbot] = useState<ChatbotData | null>(null);
  const [hasExisting, setHasExisting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchChatbots = async () => {
      setIsLoading(true);
      setError(null);

      console.log('Fetching chatbots for user:', userId); // DEBUG

      const result = await ChatbotService.getUserChatbots(userId);
      
      console.log('Chatbot fetch result:', result); // DEBUG

      if (result.success) {
        setChatbots(result.chatbots);
        setHasExisting(result.hasExisting);
        
        if (result.hasExisting && result.chatbots.length > 0) {
          setPrimaryChatbot(result.chatbots[0]);
          console.log('Primary chatbot set:', result.chatbots[0]); // DEBUG
        } else {
          console.log('No chatbots found'); // DEBUG
        }
      } else {
        console.error('Error fetching chatbots:', result.error); // DEBUG
        setError(result.error || 'Failed to fetch chatbots');
      }

      setIsLoading(false);
    };

    fetchChatbots();
  }, [userId]);

  const refetchChatbots = async () => {
    if (!userId) return;
    
    const result = await ChatbotService.getUserChatbots(userId);
    if (result.success) {
      setChatbots(result.chatbots);
      setHasExisting(result.hasExisting);
      if (result.hasExisting && result.chatbots.length > 0) {
        setPrimaryChatbot(result.chatbots[0]);
      }
    }
  };

  return {
    chatbots,
    primaryChatbot,
    hasExisting,
    isLoading,
    error,
    refetchChatbots
  };
}

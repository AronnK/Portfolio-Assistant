import { createClient } from './client';

export interface CreateChatbotParams {
  userId: string;
  collectionName: string;
  projectName?: string;
  llmProvider?: string;
  encryptedApiKey?: string;
}

export interface UpdateChatbotParams {
  chatbotId: number;
  collectionName?: string;
  llmProvider?: string;
  encryptedApiKey?: string;
}

export interface FinalizeChatbotParams {
  userId: string;
  collectionName: string;
  llmProvider: string;
  encryptedApiKey: string;
  projectName?: string;
}

interface ChatbotUpdatePayload {
  collection_name?: string;
  llm_provider?: string;
  encrypted_api_key?: string;
}

export class ChatbotService {
  /**
   * Check if user has any existing chatbots
   */
  static async getUserChatbots(userId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('Chatbot')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { 
        success: true, 
        chatbots: data || [],
        hasExisting: (data?.length || 0) > 0
      };
    } catch (error: any) {
      console.error('Error fetching chatbots:', error);
      return { 
        success: false, 
        error: error.message,
        chatbots: [],
        hasExisting: false
      };
    }
  }

  /**
   * Get user's primary/default chatbot
   */
  static async getPrimaryChatbot(userId: string) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('Chatbot')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { 
        success: true, 
        chatbot: data 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Create new chatbot entry
   */
  static async createChatbot(params: CreateChatbotParams) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('Chatbot')
        .insert([{
          user_id: params.userId,
          collection_name: params.collectionName,
          project_name: params.projectName || 'default',
          llm_provider: params.llmProvider || 'gemini',
          encrypted_api_key: params.encryptedApiKey || null,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;

      return { success: true, chatbot: data };
    } catch (error: any) {
      console.error('Error creating chatbot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Finalize a new chatbot (update empty row with collection details)
   */
  static async finalizeNewChatbot(params: FinalizeChatbotParams) {
    const supabase = createClient();
    
    try {
      // Find and update the empty row for this user
      const { data, error } = await supabase
        .from('Chatbot')
        .update({
          collection_name: params.collectionName,
          llm_provider: params.llmProvider,
          encrypted_api_key: params.encryptedApiKey,
          project_name: params.projectName || 'default',
          status: 'active'
        })
        .eq('user_id', params.userId)
        .is('collection_name', null)
        .select()
        .single();

      if (error) throw error;

      return { success: true, chatbot: data };
    } catch (error: any) {
      console.error('Error finalizing chatbot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update chatbot configuration
   */
  static async updateChatbot(params: UpdateChatbotParams) {
    const supabase = createClient();
    
    const updateData: ChatbotUpdatePayload = {};

    if (params.collectionName) updateData.collection_name = params.collectionName;
    if (params.llmProvider) updateData.llm_provider = params.llmProvider;
    if (params.encryptedApiKey) updateData.encrypted_api_key = params.encryptedApiKey;

    try {
      const { data, error } = await supabase
        .from('Chatbot')
        .update(updateData)
        .eq('id', params.chatbotId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, chatbot: data };
    } catch (error: any) {
      console.error('Error updating chatbot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete chatbot
   */
  static async deleteChatbot(chatbotId: number) {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('Chatbot')
        .update({ status: 'deleted' })
        .eq('id', chatbotId);

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting chatbot:', error);
      return { success: false, error: error.message };
    }
  }
}

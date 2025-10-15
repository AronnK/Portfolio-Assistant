export class EncryptionService {
    /**
     * Encrypt API key using server-side encryption
     */
    static async encrypt(text: string): Promise<string> {
      try {
        const response = await fetch('/api/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'encrypt', text })
        });
  
        if (!response.ok) {
          throw new Error('Encryption failed');
        }
  
        const { result } = await response.json();
        return result;
      } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
      }
    }
  
    /**
     * Decrypt API key using server-side decryption
     */
    static async decrypt(encryptedText: string): Promise<string> {
      try {
        const response = await fetch('/api/encrypt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'decrypt', text: encryptedText })
        });
  
        if (!response.ok) {
          throw new Error('Decryption failed');
        }
  
        const { result } = await response.json();
        return result;
      } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
      }
    }
  
    /**
     * Validate if string looks like an encrypted value
     * (Basic check - just verifies it's not empty and has expected format)
     */
    static isEncrypted(text: string): boolean {
      // Encrypted strings are base64 and typically longer
      return text.length > 20 && /^[A-Za-z0-9+/=]+$/.test(text);
    }
  }
  
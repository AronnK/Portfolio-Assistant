import { NextResponse } from 'next/server';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set in environment variables");
}

export async function POST(request: Request) {
  try {
    const { action, text } = await request.json();

    if (!action || !text) {
      return NextResponse.json(
        { error: 'Missing action or text' },
        { status: 400 }
      );
    }

    if (action === 'encrypt') {
      const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
      return NextResponse.json({ result: encrypted });
    } 
    
    if (action === 'decrypt') {
      const bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        return NextResponse.json(
          { error: 'Decryption failed' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ result: decrypted });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Encryption error:', error);
    return NextResponse.json(
      { error: 'Encryption operation failed' },
      { status: 500 }
    );
  }
}

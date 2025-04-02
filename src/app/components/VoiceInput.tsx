import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import { useSession } from 'next-auth/react';

type SpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
};

type SpeechRecognitionErrorEvent = {
  error: string;
  message: string;
};

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { data: session } = useSession();
  
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processVoiceInput(transcript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  const processVoiceInput = async (text: string) => {
    try {
      // First, send to backend for processing
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memory: {
            transcript_segments: [{ text }]
          },
          uid: session?.user?.omiUserId
        }),
      });

      if (!backendResponse.ok) {
        throw new Error('Failed to process voice input');
      }

      const processedData = await backendResponse.json();
      console.log('Processed data:', processedData);
      
      if (!processedData.amount || !processedData.category) {
        throw new Error('Invalid response from backend');
      }

      // Then, save to database through our authenticated API
      const saveResponse = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: processedData.amount,
          category: processedData.category,
          user_id: processedData.user_id
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save expense');
      }

      // Clear transcript after successful processing
      setTranscript('');
    } catch (error) {
      console.error('Error processing voice input:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Button
        variant="contained"
        startIcon={isListening ? <CircularProgress size={20} /> : <MicIcon />}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Start Voice Input'}
      </Button>
      {transcript && (
        <Typography variant="body1">
          You said: {transcript}
        </Typography>
      )}
    </Box>
  );
} 
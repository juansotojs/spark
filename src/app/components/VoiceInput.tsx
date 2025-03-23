import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processVoiceInput(transcript);
      };
      
      recognition.onerror = (event) => {
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
  
  const processVoiceInput = (text: string) => {
    // TODO: Implement natural language processing to extract expense details
    console.log('Processing voice input:', text);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Button
        variant="contained"
        color={isListening ? 'secondary' : 'primary'}
        onClick={startListening}
        disabled={isListening}
        startIcon={isListening ? <CircularProgress size={20} /> : <MicIcon />}
      >
        {isListening ? 'Listening...' : 'Start Voice Input'}
      </Button>
      
      {transcript && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Transcript: {transcript}
        </Typography>
      )}
    </Box>
  );
} 
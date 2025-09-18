import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Send, Phone, Video, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { ChatBubble } from '@/components/ChatBubble';
import { VideoCallModal } from '@/components/VideoCallModal';
import { PrescriptionModal } from '@/components/PrescriptionModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatMessage } from '@/types/medical';

export default function ChatScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '1',
      receiverId: '2',
      message: 'Hello Doctor, I wanted to discuss my recent symptoms.',
      timestamp: '2025-01-14T10:30:00Z',
      type: 'text',
      isRead: true,
    },
    {
      id: '2',
      senderId: '2',
      receiverId: '1',
      message: 'Hello! I\'m here to help. Please tell me about your symptoms.',
      timestamp: '2025-01-14T10:31:00Z',
      type: 'text',
      isRead: true,
    },
    {
      id: '3',
      senderId: '1',
      receiverId: '2',
      message: 'I\'ve been experiencing fever and headache for the past 2 days. Should I be concerned?',
      timestamp: '2025-01-14T10:32:00Z',
      type: 'text',
      isRead: true,
    },
    {
      id: '4',
      senderId: '2',
      receiverId: '1',
      message: 'I understand your concern. Let\'s schedule a video consultation to discuss this properly. Are you available this afternoon?',
      timestamp: '2025-01-14T10:33:00Z',
      type: 'text',
      isRead: true,
    },
  ]);

  if (!user) return null;

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: user.role === 'patient' ? '1' : '2',
        message: message.trim(),
        timestamp: new Date().toISOString(),
        type: 'text',
        isRead: false,
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const chatPartner = user.role === 'patient' ? 'Dr. Preet Singh' : 'Amarjit Kaur';

  const handleVoiceCall = () => {
    Alert.alert('Voice Call', `Calling ${chatPartner}...`);
  };

  const handleVideoCall = () => {
    setShowVideoCall(true);
  };

  const handleMoreOptions = () => {
    const options = user.role === 'doctor' 
      ? ['Write Prescription', 'View Health Records', 'Schedule Follow-up']
      : ['View Prescription', 'Share Health Records', 'Emergency Call'];

    Alert.alert('More Options', 'Choose an action:', [
      ...options.map(option => ({
        text: option,
        onPress: () => {
          if (option === 'Write Prescription') {
            setShowPrescription(true);
          } else {
            Alert.alert('Feature', `${option} feature coming soon`);
          }
        }
      })),
      { text: 'Cancel', style: 'cancel' }
    ]);
  };
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <View style={styles.chatHeader}>
        <View style={styles.partnerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {chatPartner.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View>
            <Text style={styles.partnerName}>{chatPartner}</Text>
            <Text style={styles.partnerStatus}>
              {user.role === 'patient' ? 'General Medicine' : 'Patient'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleVoiceCall}>
            <Phone size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
            <Video size={20} color="#2563EB" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMoreOptions}>
            <MoreHorizontal size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderId === user.id}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <VideoCallModal
        visible={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        participantName={chatPartner}
        isDoctor={user.role === 'doctor'}
      />

      {user.role === 'doctor' && (
        <PrescriptionModal
          visible={showPrescription}
          onClose={() => setShowPrescription(false)}
          patientName={chatPartner}
          onSavePrescription={(medicines, instructions) => {
            console.log('Prescription saved:', { medicines, instructions });
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  partnerStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
});
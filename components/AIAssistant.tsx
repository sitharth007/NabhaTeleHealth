import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Bot, Send, Mic, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

export function AIAssistant() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: language === 'pa' ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' :
            language === 'hi' ? 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' :
            'Hello! I\'m your AI Health Assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        text: inputText,
        isBot: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: AIMessage = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(inputText, language),
          isBot: true,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);

      setInputText('');
    }
  };

  const quickQuestions = [
    language === 'pa' ? 'ਬੁਖਾਰ ਦਾ ਇਲਾਜ' : language === 'hi' ? 'बुखार का इलाज' : 'Fever treatment',
    language === 'pa' ? 'ਸਿਰ ਦਰਦ ਦੀ ਦਵਾਈ' : language === 'hi' ? 'सिर दर्द की दवा' : 'Headache medicine',
    language === 'pa' ? 'ਪਹਿਲੀ ਸਹਾਇਤਾ' : language === 'hi' ? 'प्राथमिक चिकित्सा' : 'First aid',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.botIcon}>
          <Bot size={24} color="#2563EB" />
        </View>
        <Text style={styles.title}>{t('ai.askQuestion')}</Text>
      </View>

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isBot ? styles.botBubble : styles.userBubble,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isBot ? styles.botText : styles.userText,
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickQuestions}>
        <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
        <View style={styles.quickQuestionsContainer}>
          {quickQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickQuestionButton}
              onPress={() => setInputText(question)}
            >
              <HelpCircle size={16} color="#6B7280" />
              <Text style={styles.quickQuestionText}>{question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={language === 'pa' ? 'ਆਪਣਾ ਸਵਾਲ ਪੁੱਛੋ...' : 
                     language === 'hi' ? 'अपना सवाल पूछें...' : 
                     'Ask your question...'}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.micButton}>
          <Mic size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getAIResponse(question: string, language: string): string {
  const responses = {
    en: {
      fever: "For fever, rest and stay hydrated. Take paracetamol 500mg every 6-8 hours. If fever persists over 3 days or exceeds 102°F, consult a doctor immediately.",
      headache: "For headaches, try rest in a dark room, stay hydrated, and consider paracetamol. If severe or persistent, please consult a doctor.",
      firstAid: "For cuts: Clean with water, apply pressure to stop bleeding, use antiseptic, and bandage. For burns: Cool with water for 10 minutes, avoid ice.",
      default: "I understand your concern. For specific medical advice, I recommend consulting with one of our qualified doctors. Would you like me to help you book an appointment?",
    },
    hi: {
      fever: "बुखार के लिए, आराम करें और पानी पिएं। पैरासिटामोल 500mg हर 6-8 घंटे में लें। अगर बुखार 3 दिन से ज्यादा रहे या 102°F से अधिक हो, तुरंत डॉक्टर से मिलें।",
      headache: "सिर दर्द के लिए, अंधेरे कमरे में आराम करें, पानी पिएं, और पैरासिटामोल ले सकते हैं। अगर तेज़ या लगातार दर्द हो, डॉक्टर से सलाह लें।",
      firstAid: "कटने पर: पानी से साफ करें, खून रोकने के लिए दबाव डालें, एंटीसेप्टिक लगाएं और पट्टी बांधें। जलने पर: 10 मिनट तक पानी से ठंडा करें, बर्फ न लगाएं।",
      default: "मैं आपकी चिंता समझता हूं। विशिष्ट चिकित्सा सलाह के लिए, मैं हमारे योग्य डॉक्टरों से सलाह लेने की सलाह देता हूं। क्या आप चाहेंगे कि मैं अपॉइंटमेंट बुक करने में मदद करूं?",
    },
    pa: {
      fever: "ਬੁਖਾਰ ਲਈ, ਆਰਾਮ ਕਰੋ ਅਤੇ ਪਾਣੀ ਪੀਓ। ਪੈਰਾਸਿਟਾਮੋਲ 500mg ਹਰ 6-8 ਘੰਟੇ ਬਾਅਦ ਲਓ। ਜੇ ਬੁਖਾਰ 3 ਦਿਨ ਤੋਂ ਜ਼ਿਆਦਾ ਰਹੇ ਜਾਂ 102°F ਤੋਂ ਜ਼ਿਆਦਾ ਹੋਵੇ, ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।",
      headache: "ਸਿਰ ਦਰਦ ਲਈ, ਹਨੇਰੇ ਕਮਰੇ ਵਿੱਚ ਆਰਾਮ ਕਰੋ, ਪਾਣੀ ਪੀਓ, ਅਤੇ ਪੈਰਾਸਿਟਾਮੋਲ ਲੈ ਸਕਦੇ ਹੋ। ਜੇ ਤੇਜ਼ ਜਾਂ ਲਗਾਤਾਰ ਦਰਦ ਹੋਵੇ, ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਕਰੋ।",
      firstAid: "ਕੱਟਣ ਤੇ: ਪਾਣੀ ਨਾਲ ਸਾਫ਼ ਕਰੋ, ਖੂਨ ਰੋਕਣ ਲਈ ਦਬਾਅ ਪਾਓ, ਐਂਟੀਸੈਪਟਿਕ ਲਗਾਓ ਅਤੇ ਪੱਟੀ ਬੰਨ੍ਹੋ। ਜਲਣ ਤੇ: 10 ਮਿੰਟ ਤੱਕ ਪਾਣੀ ਨਾਲ ਠੰਡਾ ਕਰੋ, ਬਰਫ਼ ਨਾ ਲਗਾਓ।",
      default: "ਮੈਂ ਤੁਹਾਡੀ ਚਿੰਤਾ ਸਮਝਦਾ ਹਾਂ। ਖਾਸ ਮੈਡੀਕਲ ਸਲਾਹ ਲਈ, ਮੈਂ ਸਾਡੇ ਯੋਗ ਡਾਕਟਰਾਂ ਨਾਲ ਸਲਾਹ ਕਰਨ ਦੀ ਸਿਫਾਰਿਸ਼ ਕਰਦਾ ਹਾਂ। ਕੀ ਤੁਸੀਂ ਚਾਹੋਗੇ ਕਿ ਮੈਂ ਮੁਲਾਕਾਤ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਾਂ?",
    },
  };

  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('fever') || lowerQuestion.includes('बुखार') || lowerQuestion.includes('ਬੁਖਾਰ')) {
    return responses[language as keyof typeof responses]?.fever || responses.en.fever;
  }
  if (lowerQuestion.includes('headache') || lowerQuestion.includes('सिर दर्द') || lowerQuestion.includes('ਸਿਰ ਦਰਦ')) {
    return responses[language as keyof typeof responses]?.headache || responses.en.headache;
  }
  if (lowerQuestion.includes('first aid') || lowerQuestion.includes('प्राथमिक चिकित्सा') || lowerQuestion.includes('ਪਹਿਲੀ ਸਹਾਇਤਾ')) {
    return responses[language as keyof typeof responses]?.firstAid || responses.en.firstAid;
  }
  
  return responses[language as keyof typeof responses]?.default || responses.en.default;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    marginVertical: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  quickQuestions: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  quickQuestionsContainer: {
    gap: 8,
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 8,
  },
  quickQuestionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    gap: 8,
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
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botBubble: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    alignSelf: 'flex-end',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 12,
  },
  botText: {
    color: '#1F2937',
  },
  userText: {
    color: '#FFFFFF',
  },
});
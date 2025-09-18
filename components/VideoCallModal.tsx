import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { Video, VideoOff, Mic, MicOff, Phone, MessageCircle, X, Monitor, Users, Settings, Camera, Volume2, VolumeX } from 'lucide-react-native';

interface VideoCallModalProps {
  visible: boolean;
  onClose: () => void;
  participantName: string;
  isDoctor?: boolean;
}

export function VideoCallModal({ visible, onClose, participantName, isDoctor = false }: VideoCallModalProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [showSettings, setShowSettings] = useState(false);
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [participants, setParticipants] = useState([participantName]);

  useEffect(() => {
    if (visible) {
      setCallStatus('connecting');
      // Simulate connection
      const timer = setTimeout(() => {
        setCallStatus('connected');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    let interval: number;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End Call', 
          style: 'destructive',
          onPress: () => {
            setCallStatus('ended');
            setCallDuration(0);
            onClose();
          }
        }
      ]
    );
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    Alert.alert(
      isScreenSharing ? 'Screen Sharing Stopped' : 'Screen Sharing Started',
      isScreenSharing ? 'You stopped sharing your screen' : 'You are now sharing your screen'
    );
  };

  const handleInviteParticipant = () => {
    Alert.alert('Invite Participant', 'Feature coming soon - ability to invite specialists or family members to the consultation');
  };

  const handleRecordCall = () => {
    Alert.alert(
      'Record Consultation',
      'Do you want to start recording this consultation? Both parties will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Recording', onPress: () => Alert.alert('Recording Started', 'This consultation is now being recorded') }
      ]
    );
  };

  const handleSwitchCamera = () => {
    Alert.alert('Camera Switched', 'Switched to front/back camera');
  };

  const qualityOptions = [
    { value: 'low', label: 'Low (Data Saver)', description: '240p - Best for 2G/3G' },
    { value: 'medium', label: 'Medium (Balanced)', description: '480p - Good quality' },
    { value: 'high', label: 'High (Best Quality)', description: '720p - Requires good connection' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>{participantName}</Text>
            <Text style={styles.callStatus}>
              {callStatus === 'connecting' ? 'Connecting...' : 
               callStatus === 'connected' ? formatDuration(callDuration) : 'Call Ended'}
            </Text>
            <View style={styles.callMeta}>
              <Text style={styles.callMetaText}>
                {videoQuality.toUpperCase()} • {participants.length} participant{participants.length > 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setShowSettings(!showSettings)} style={styles.headerButton}>
              <Settings size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {showSettings && (
          <View style={styles.settingsPanel}>
            <Text style={styles.settingsTitle}>Video Quality</Text>
            <View style={styles.qualityOptions}>
              {qualityOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    videoQuality === option.value && styles.selectedQualityOption,
                  ]}
                  onPress={() => setVideoQuality(option.value as any)}
                >
                  <Text style={[
                    styles.qualityLabel,
                    videoQuality === option.value && styles.selectedQualityLabel,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.qualityDescription}>{option.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.videoContainer}>
          <View style={styles.remoteVideo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {participantName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            {callStatus === 'connecting' && (
              <View style={styles.connectingOverlay}>
                <Text style={styles.connectingText}>Connecting...</Text>
                <Text style={styles.connectingSubtext}>Please wait while we establish the connection</Text>
              </View>
            )}
            {isScreenSharing && (
              <View style={styles.screenShareOverlay}>
                <Monitor size={24} color="#FFFFFF" />
                <Text style={styles.screenShareText}>Screen Sharing Active</Text>
              </View>
            )}
          </View>

          <View style={styles.localVideo}>
            <View style={styles.localVideoPlaceholder}>
              <Text style={styles.localVideoText}>You</Text>
              {!isVideoEnabled && (
                <VideoOff size={20} color="#FFFFFF" />
              )}
            </View>
            <TouchableOpacity style={styles.switchCameraButton} onPress={handleSwitchCamera}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controls}>
          <View style={styles.primaryControls}>
            <TouchableOpacity
              style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
              onPress={() => setIsAudioEnabled(!isAudioEnabled)}
            >
              {isAudioEnabled ? 
                <Mic size={24} color="#FFFFFF" /> : 
                <MicOff size={24} color="#FFFFFF" />
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
              onPress={() => setIsVideoEnabled(!isVideoEnabled)}
            >
              {isVideoEnabled ? 
                <Video size={24} color="#FFFFFF" /> : 
                <VideoOff size={24} color="#FFFFFF" />
              }
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isSpeakerOn ? styles.speakerOnButton : styles.speakerOffButton]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? 
                <Volume2 size={24} color="#FFFFFF" /> : 
                <VolumeX size={24} color="#FFFFFF" />
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert('Chat', 'Opening chat panel...')}>
              <MessageCircle size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
              <Phone size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryControls}>
            <TouchableOpacity
              style={[styles.secondaryButton, isScreenSharing && styles.activeSecondaryButton]}
              onPress={handleScreenShare}
            >
              <Monitor size={20} color={isScreenSharing ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.secondaryButtonText, isScreenSharing && styles.activeSecondaryButtonText]}>
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleInviteParticipant}>
              <Users size={20} color="#6B7280" />
              <Text style={styles.secondaryButtonText}>Invite</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleRecordCall}>
              <Video size={20} color="#6B7280" />
              <Text style={styles.secondaryButtonText}>Record</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isDoctor && (
          <View style={styles.doctorControls}>
            <TouchableOpacity style={styles.prescriptionButton} onPress={() => Alert.alert('Prescription', 'Opening prescription writer...')}>
              <Text style={styles.prescriptionButtonText}>Write Prescription</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notesButton} onPress={() => Alert.alert('Notes', 'Opening consultation notes...')}>
              <Text style={styles.notesButtonText}>Add Notes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callStatus: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  callMeta: {
    marginTop: 4,
  },
  callMetaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  settingsPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  qualityOptions: {
    gap: 8,
  },
  qualityOption: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedQualityOption: {
    backgroundColor: '#2563EB',
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  selectedQualityLabel: {
    fontWeight: '600',
  },
  qualityDescription: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 2,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  connectingOverlay: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 16,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  connectingSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  screenShareOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  screenShareText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  switchCameraButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 16,
    padding: 6,
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  primaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 16,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: '#EF4444',
  },
  speakerOnButton: {
    backgroundColor: '#10B981',
  },
  speakerOffButton: {
    backgroundColor: '#4B5563',
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  activeSecondaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButtonText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '500',
  },
  activeSecondaryButtonText: {
    color: '#FFFFFF',
  },
  doctorControls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  prescriptionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  prescriptionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  notesButton: {
    flex: 1,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  notesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
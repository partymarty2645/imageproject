import { useState, useEffect, useCallback, useRef } from 'react';
import { MainViewProps, ChatMessage, DailyData } from '../types';
import { generateDailyImage } from '../services/geminiService';
import { DAILY_QUESTIONS, INITIAL_YESTERDAY_IMAGE, ALLOWED_USERS } from '../constants';
import { WEEKDAYS } from '../constants/appConstants';
import * as firestoreService from '../services/firestoreService';
import { useToast } from '../contexts/ToastContext';

export const useDailyView = ({ currentUser, onLogout, onImageLoad }: MainViewProps) => {
  // --- STATE MANAGEMENT ---
  const [dailyData, setDailyData] = useState<{ [date: string]: DailyData }>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [todayAnswer, setTodayAnswer] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuestionChoice, setShowQuestionChoice] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // --- DATE HELPERS ---
  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };
  const todayDate = getTodayDateString();
  const yesterdayDate = getYesterdayDateString();
  const [viewingDate, setViewingDate] = useState<string>(yesterdayDate);

  // --- CORE LOGIC ---
  const handleCreateDailyData = useCallback(async (question: string) => {
    console.log('handleCreateDailyData called with question:', question);
    setLoading(true);
    setError(null);

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('Daily data creation timed out');
      setError("Het duurt te lang om een nieuw moment te creëren. Probeer de pagina te vernieuwen.");
      setLoading(false);
    }, 30000); // 30 second timeout

    try {
      // Use the new inspirational image service
      const { generateDailyInspirationalImage } = await import('../services/inspirationalImageService');
      const imageUrl = await generateDailyInspirationalImage();
      console.log('Image generated successfully:', imageUrl);

      const dailyData: Omit<DailyData, 'chat'> = {
        date: todayDate,
        imageUrl,
        question,
        questionBy: currentUser.id,
        answers: []
      };

      await firestoreService.createDailyData(todayDate, dailyData);
      console.log('Daily data created successfully');

      clearTimeout(timeoutId);
      // Close modal immediately after successful creation
      setShowQuestionChoice(false);
      console.log('Modal closed immediately after success');
      // Loading will be cleared by the Firestore listener when data is received
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to create daily data:", err);
      const errorMessage = err instanceof Error ? err.message : "Kon het dagelijkse moment niet aanmaken.";
      setError(errorMessage);
      showToast("Dagelijks moment aanmaken mislukt.", "error");
      setLoading(false); // Clear loading on error so user can retry
      console.log('Error occurred, keeping modal visible for retry');
    }
  }, [todayDate, showToast, currentUser.id]);

  const initializeOrUpdateData = useCallback(async () => {
    console.log('initializeOrUpdateData: Starting initialization');
    setLoading(true);
    setError(null);
    setWaitingForPartner(false);

    try {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const isMySpecialDay = (dayOfWeek === WEEKDAYS.FRIDAY && currentUser.id === 'user1') || (dayOfWeek === WEEKDAYS.SATURDAY && currentUser.id === 'user2');
      const partnerIsChoosing = (dayOfWeek === WEEKDAYS.FRIDAY && currentUser.id === 'user2') || (dayOfWeek === WEEKDAYS.SATURDAY && currentUser.id === 'user1');

      console.log('initializeOrUpdateData: Checking for existing daily data');
      let todayData = await firestoreService.getDailyData(todayDate);

      if (!todayData) {
        console.log('initializeOrUpdateData: No existing data found');
        if (isMySpecialDay) {
          console.log('initializeOrUpdateData: It is my special day - showing question choice');
          setShowQuestionChoice(true);
          setLoading(false);
          return;
        }
        if (partnerIsChoosing) {
          console.log('initializeOrUpdateData: Partner is choosing - waiting');
          setWaitingForPartner(true);
          setLoading(false);
          return;
        }

        console.log('initializeOrUpdateData: Creating new daily data for weekday');
        const newQuestion = DAILY_QUESTIONS[Math.floor(Math.random() * DAILY_QUESTIONS.length)];
        console.log('initializeOrUpdateData: Selected question:', newQuestion.substring(0, 50) + '...');

        // Create the data - the Firestore listener will handle updating the state
        await handleCreateDailyData(newQuestion);
        // Don't set loading to false here - let the Firestore listener handle it
        console.log('initializeOrUpdateData: Daily data creation initiated');
      } else {
        console.log('initializeOrUpdateData: Existing data found, setting loading to false');
        setLoading(false);
      }
    } catch (err) {
      console.error("initializeOrUpdateData: Failed to initialize:", err);
      const errorMessage = err instanceof Error ? err.message : "Er is iets misgegaan bij het laden van jullie dagelijkse moment.";
      setError(errorMessage);
      setLoading(false);
    }
  }, [currentUser.id, todayDate, handleCreateDailyData]);

  // --- EFFECTS ---
  useEffect(() => {
    initializeOrUpdateData();
    firestoreService.getAvailableDates().then(setAvailableDates);
  }, [initializeOrUpdateData]);

  useEffect(() => {
    const handleListenerError = (error: Error) => {
      console.error('Listener error:', error);
      setError('Er is een probleem met de real-time verbinding. Probeer de pagina te vernieuwen.');
    };

    const unsubscribe = firestoreService.listenToDailyData(
      viewingDate,
      (data) => {
        console.log('Daily data listener triggered for date:', viewingDate, 'data exists:', !!data);
        if (data) {
          console.log('Updating dailyData state for date:', viewingDate);
          if (viewingDate === todayDate && waitingForPartner) {
            console.log('Setting waitingForPartner to false');
            setWaitingForPartner(false);
          }
          setDailyData(prev => {
            const newData = { ...prev, [viewingDate]: data };
            console.log('New dailyData state:', Object.keys(newData));
            return newData;
          });

          // Always set loading to false when we receive data for today
          if (viewingDate === todayDate) {
            console.log('Received data for today, setting loading to false');
            setLoading(false);
          }
        } else {
          // If we get null data for today and we're not in a special state, something went wrong
          if (viewingDate === todayDate && !showQuestionChoice && !waitingForPartner) {
            console.log('Received null data for today without special state - this might be an error');
            // Don't set loading here, let initializeOrUpdateData handle it
          }
        }
      },
      handleListenerError
    );

    // Also listen to today's data if it's different from viewing date
    let unsubscribeToday: (() => void) | undefined;
    if (viewingDate !== todayDate) {
      unsubscribeToday = firestoreService.listenToDailyData(
        todayDate,
        (data) => {
          console.log('Today data listener triggered for date:', todayDate, 'data exists:', !!data);
          if (data) {
            console.log('Updating dailyData state for today:', todayDate);
            setDailyData(prev => {
              const newData = { ...prev, [todayDate]: data };
              console.log('New dailyData state with today:', Object.keys(newData));
              return newData;
            });

            // Set loading to false when we receive today's data
            console.log('Received data for today, setting loading to false');
            setLoading(false);
          }
        },
        handleListenerError
      );
    }

    const unsubscribeChat = firestoreService.listenToChat(
      viewingDate,
      (messages) => setChatMessages(messages),
      handleListenerError
    );

    return () => {
      unsubscribe();
      if (unsubscribeToday) unsubscribeToday();
      unsubscribeChat();
    };
  }, [viewingDate, currentUser.id, todayDate, showQuestionChoice, waitingForPartner]);

  useEffect(() => {
    const imageSource = dailyData[viewingDate]?.imageUrl || (viewingDate === todayDate ? dailyData[todayDate]?.imageUrl : null);
    if (imageSource) onImageLoad(imageSource);
  }, [dailyData, onImageLoad, todayDate, viewingDate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // --- HANDLERS ---
  const handleSaveAnswer = useCallback(async () => {
    if (!dailyData[todayDate] || todayAnswer.trim() === '') return;
    setIsSavingAnswer(true);
    try {
      await firestoreService.saveAnswer(todayDate, currentUser.id, todayAnswer);
      showToast("Je antwoord is opgeslagen ✨", "success");
    } catch (e) {
      showToast("Opslaan mislukt", "error");
    } finally {
      setIsSavingAnswer(false);
    }
  }, [dailyData, todayAnswer, todayDate, currentUser.id, showToast]);

  const handleSendChatMessage = useCallback(async () => {
    if (chatMessage.trim() === '' || viewingDate !== yesterdayDate) return;
    setIsSendingChat(true);
    const newChatMessage = { userId: currentUser.id, username: currentUser.username, message: chatMessage };
    try {
      await firestoreService.addChatMessage(yesterdayDate, newChatMessage);
      setChatMessage('');
      setShowEmojiPicker(false);
    } catch (e) {
      showToast("Versturen mislukt", "error");
    } finally {
      setIsSendingChat(false);
    }
  }, [chatMessage, viewingDate, yesterdayDate, currentUser.id, currentUser.username, showToast]);
  
  const handleNavigation = useCallback(async (direction: 'prev' | 'next') => {
    const currentDate = new Date(viewingDate);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    const newDateString = currentDate.toISOString().split('T')[0];
    if (availableDates.includes(newDateString) || newDateString === todayDate) {
        setViewingDate(newDateString);
    }
  }, [viewingDate, availableDates, todayDate]);

  const handleGenerateQuestion = useCallback(async () => {
    console.log('handleGenerateQuestion called');
    const newQuestion = DAILY_QUESTIONS[Math.floor(Math.random() * DAILY_QUESTIONS.length)];
    console.log('Generated question:', newQuestion);
    await handleCreateDailyData(newQuestion);
  }, [handleCreateDailyData]);

  const handleSubmitCustomQuestion = useCallback(async (question: string) => {
    console.log('handleSubmitCustomQuestion called with:', question);
    await handleCreateDailyData(question);
  }, [handleCreateDailyData]);

  // --- DERIVED STATE & FORMATTERS ---
  const formatTimestamp = (ts: ChatMessage['timestamp']) => ts.toDate().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  const formatDateForDisplay = (dateString: string) => {
    if (dateString === yesterdayDate) return "Gisteren";
    if (dateString === todayDate) return "Vandaag";
    return new Date(dateString).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  const currentViewingData = dailyData[viewingDate];
  const partner = ALLOWED_USERS.find(u => u.id === currentUser.partnerId);
  const myAnswer = currentViewingData?.answers.find(a => a.userId === currentUser.id);
  const partnerAnswer = currentViewingData?.answers.find(a => a.userId === currentUser.partnerId);
  const hasSubmittedToday = dailyData[todayDate]?.answers.some(a => a.userId === currentUser.id);
  const isViewingYesterday = viewingDate === yesterdayDate;

  return {
    state: {
      loading, error, dailyData, chatMessages, todayAnswer, chatMessage,
      showEmojiPicker, showQuestionChoice, waitingForPartner, viewingDate,
      todayDate, yesterdayDate, todayData: dailyData[todayDate], currentViewingData,
      isSavingAnswer, isSendingChat, showCalendar, availableDates, chatEndRef
    },
    handlers: {
      handleLogout: onLogout,
      handleSaveAnswer, handleSendChatMessage, handleNavigation,
      handleEmojiSelect: (emoji: string) => setChatMessage(prev => prev + emoji),
      handleGenerateQuestion, handleSubmitCustomQuestion,
      setTodayAnswer, setChatMessage, setShowEmojiPicker, setViewingDate,
      setShowCalendar, setShowQuestionChoice
    },
    derived: {
      partner, hasSubmittedToday, isViewingYesterday, formatTimestamp,
      formatDateForDisplay, myAnswer, partnerAnswer
    }
  };
};

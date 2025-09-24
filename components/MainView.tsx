import React, { Suspense } from 'react';
import { MainViewProps, ChatMessage } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { LogoutIcon, SendIcon, ChevronLeftIcon, ChevronRightIcon, EmojiIcon, CalendarIcon } from './icons';
import EmojiPicker from './EmojiPicker';
import { useDailyView } from '../hooks/useDailyView';
import { UI } from '../constants/appConstants';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';

// Lazy load modal components
const CalendarModal = React.lazy(() => import('./CalendarModal'));
const QuestionChoiceModal = React.lazy(() => import('./QuestionChoiceModal'));

const WaitingForPartnerView: React.FC<{partnerName: string}> = ({partnerName}) => {
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', textAlign: 'center', padding: '20px',
        },
        text: {
            color: '#ede7f6', fontFamily: "'Playfair Display', serif", fontSize: '1.5rem',
            letterSpacing: '1px', textShadow: '0 0 8px #e7bda4',
        },
    };
    return (
        <div style={styles.container}>
            <p style={styles.text}>Wachten tot {partnerName} de vraag voor vandaag heeft gekozen... ✨</p>
        </div>
    );
}

const MainView: React.FC<MainViewProps> = (props) => {
  const { currentUser, isMobile, onLogout } = props;
  const { state, handlers, derived } = useDailyView(props);

  const {
    loading, error, chatMessages, todayAnswer, chatMessage,
    showEmojiPicker, showQuestionChoice, waitingForPartner,
    viewingDate, todayData, currentViewingData, showCalendar, availableDates,
    isSavingAnswer, isSendingChat
  } = state;

  console.log('MainView render - showQuestionChoice:', showQuestionChoice, 'todayData:', !!todayData, 'loading:', loading, 'error:', error);

  const {
    handleLogout, handleSaveAnswer, handleSendChatMessage,
    handleNavigation, handleEmojiSelect, handleGenerateQuestion,
    handleSubmitCustomQuestion, setTodayAnswer, setChatMessage,
    setShowEmojiPicker, setViewingDate, setShowCalendar, setShowQuestionChoice
  } = handlers;

  const {
    partner, hasSubmittedToday, isViewingYesterday,
    formatTimestamp, formatDateForDisplay, myAnswer, partnerAnswer,
  } = derived;

  const animationKeyframes = `
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;

  const styles: { [key: string]: React.CSSProperties } = {
    main: { maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '10px' : '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '10px' : '10px 20px', borderBottom: '1px solid #7b6285' },
    title: { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.5rem' : '2rem', color: '#ede7f6', textShadow: '0 0 8px #e7bda4' },
    logoutButton: { background: 'none', border: '1px solid #a981a9', color: '#ede7f6', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background-color 0.3s' },
    contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: isMobile ? '20px' : '40px', marginTop: '30px', opacity: showQuestionChoice ? 0.2 : 1, transition: 'opacity 0.3s' },
    card: { background: 'rgba(44, 36, 59, 0.75)', borderRadius: '15px', padding: isMobile ? '15px' : '25px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.1)' },
    cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: isMobile ? '1.4rem' : '1.7rem', color: '#e7bda4', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    navControls: { display: 'flex', alignItems: 'center', gap: '5px' },
    navButton: { background: 'none', border: 'none', color: '#e7bda4', cursor: 'pointer', padding: '5px' },
    dateDisplay: { fontSize: '1.2rem', color: '#e7bda4', textAlign: 'center'},
    image: { width: '100%', height: 'auto', borderRadius: '10px', marginBottom: '20px', border: '2px solid #7b6285' },
    question: { fontStyle: 'italic', color: '#d1c4e9', marginBottom: '20px', fontSize: isMobile ? '1rem' : '1.1rem', lineHeight: 1.6 },
    textarea: { boxSizing: 'border-box', width: '100%', height: '100px', background: '#211a2f', border: '1px solid #7b6285', borderRadius: '8px', color: '#ede7f6', padding: '12px', fontSize: '1rem', resize: 'vertical', fontFamily: "'Lato', sans-serif" },
    button: { background: '#a981a9', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '15px', transition: 'background-color 0.3s', minWidth: '180px', textAlign: 'center' },
    buttonDisabled: { backgroundColor: '#7b6285', cursor: 'not-allowed' },
    answerBox: { background: 'rgba(33, 26, 47, 0.7)', padding: '15px', borderRadius: '8px', marginBottom: '15px' },
    answerUser: { fontWeight: 'bold', color: '#e7bda4', marginBottom: '5px' },
    answerText: { color: '#ede7f6', lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
    chatContainer: { marginTop: '20px' },
    chatBox: { height: '200px', overflowY: 'auto', background: 'rgba(33, 26, 47, 0.7)', borderRadius: '8px', padding: '10px', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' },
    chatMessage: { display: 'flex', flexDirection: 'column', padding: '8px 12px', borderRadius: '15px', maxWidth: '80%', wordWrap: 'break-word', animation: 'fadeInUp 0.3s ease-out' },
    myMessage: { background: 'linear-gradient(45deg, #a981a9, #8b6b8b)', color: 'white', alignSelf: 'flex-end', borderBottomRightRadius: '4px' },
    partnerMessage: { background: '#5a4a6b', color: '#ede7f6', alignSelf: 'flex-start', borderBottomLeftRadius: '4px' },
    chatMessageContent: { marginBottom: '4px' },
    timestamp: { fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' },
    chatInputContainer: { display: 'flex', gap: '10px', position: 'relative' },
    chatInput: { flex: 1, background: '#211a2f', border: '1px solid #7b6285', borderRadius: '8px', color: '#ede7f6', padding: '10px 45px 10px 10px', fontSize: '1rem', fontFamily: "'Lato', sans-serif" },
    emojiButton: { position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#bca0bc', padding: '5px' },
    sendButton: { background: '#a981a9', border: 'none', borderRadius: '8px', padding: '0 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    submittedMessage: { color: '#bca0bc', fontStyle: 'italic', marginTop: '15px' },
    disabledText: { color: '#8d809f', fontStyle: 'italic', textAlign: 'center', marginTop: '15px' }
  };
  
  if (waitingForPartner) return <WaitingForPartnerView partnerName={partner?.username || 'je partner'} />;
  if (loading && !currentViewingData) return <LoadingSpinner />;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
  if (loading && !todayData && !showQuestionChoice) return <LoadingSpinner />;

  return (
    <main style={styles.main}>
        {showQuestionChoice && (
            <Suspense fallback={<LoadingSpinner />}>
                <QuestionChoiceModal 
                    username={currentUser.username}
                    onGenerate={handleGenerateQuestion}
                    onSubmit={handleSubmitCustomQuestion}
                    onClose={() => setShowQuestionChoice(false)}
                />
            </Suspense>
        )}
        {showCalendar && (
            <Suspense fallback={<LoadingSpinner />}>
                <CalendarModal
                    isOpen={showCalendar}
                    onClose={() => setShowCalendar(false)}
                    onDateSelect={(date) => {
                        setViewingDate(date);
                        setShowCalendar(false);
                    }}
                    availableDates={availableDates}
                    currentDate={viewingDate}
                />
            </Suspense>
        )}
      <style>{animationKeyframes}</style>
      <header style={styles.header}>
        <h1 style={styles.title}>A Thoughtful Moment</h1>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'rgba(169, 129, 169, 0.2)')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <LogoutIcon /> {!isMobile && 'Uitloggen'}
        </button>
      </header>

      {todayData && (
        <div style={styles.contentGrid}>
            <section style={styles.card}>
            <h2 style={styles.cardTitle}>De Vonk van {formatDateForDisplay(state.todayDate)}</h2>
            <img 
              src={todayData.imageUrl} 
              alt="Generated art for today" 
              style={styles.image} 
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNWE0YTYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2VkZTdlNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFmYmVlbGRpbmcgbmlldCBiZXNjaGlrYmFhci48L3RleHQ+PC9zdmc+';
                e.currentTarget.alt = 'Afbeelding niet beschikbaar - klik om opnieuw te genereren';
                e.currentTarget.style.cursor = 'pointer';
                e.currentTarget.onclick = () => {
                  // Try to regenerate the image
                  if (window.confirm('Afbeelding opnieuw genereren?')) {
                    // This would require implementing a regenerate function
                    // For now, just reload the page
                    window.location.reload();
                  }
                };
              }}
            />
            <p style={styles.question}>{todayData.question}</p>
            <Textarea
                value={todayAnswer}
                onChange={(e) => setTodayAnswer(e.target.value)}
                placeholder="Jouw antwoord voor vandaag... (zichtbaar voor je partner vanaf morgen)"
                disabled={hasSubmittedToday || isSavingAnswer}
                maxLength={UI.ANSWER_MAX_LENGTH}
                className="min-h-[100px] resize-none"
            />
            {hasSubmittedToday ? (
                <p style={styles.submittedMessage}>Je gedachte voor vandaag is opgeslagen. ✨</p>
            ) : (
                <Button 
                    onClick={handleSaveAnswer} 
                    disabled={isSavingAnswer}
                    className="mt-4"
                >
                    {isSavingAnswer ? 'Opslaan...' : 'Mijn Antwoord Opslaan'}
                </Button>
            )}
            </section>

            {currentViewingData ? (
            <section style={styles.card}>
                <h2 style={styles.cardTitle}>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Reflectie</span>
                    <div style={styles.navControls}>
                        <button style={styles.navButton} onClick={() => handleNavigation('prev')} aria-label="Vorige dag"><ChevronLeftIcon /></button>
                        <span style={styles.dateDisplay} onClick={() => setShowCalendar(true)}>{formatDateForDisplay(viewingDate)}</span>
                        <button style={styles.navButton} onClick={() => setShowCalendar(true)} aria-label="Open kalender"><CalendarIcon /></button>
                        <button style={styles.navButton} onClick={() => handleNavigation('next')} disabled={viewingDate === state.yesterdayDate} aria-label="Volgende dag"><ChevronRightIcon /></button>
                    </div>
                </h2>
                <img 
                  src={currentViewingData.imageUrl} 
                  alt={`Generated art from ${viewingDate}`} 
                  style={styles.image}
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNWE0YTYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2VkZTdlNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFmYmVlbGRpbmcgbmlldCBiZXNjaGlrYmFhci48L3RleHQ+PC9zdmc+';
                    e.currentTarget.alt = 'Afbeelding niet beschikbaar';
                  }}
                />
                <p style={styles.question}>{currentViewingData.question}</p>
                
                <div style={styles.answerBox}>
                    <p style={styles.answerUser}>{currentUser.username}'s antwoord:</p>
                    <p style={styles.answerText}>{myAnswer?.answer || "Je hebt op deze dag geen antwoord gegeven."}</p>
                </div>
                <div style={styles.answerBox}>
                    <p style={styles.answerUser}>{partner?.username}'s antwoord:</p>
                    <p style={styles.answerText}>
                        {viewingDate === state.todayDate 
                            ? "Het antwoord van je partner wordt morgen zichtbaar. ✨" 
                            : (partnerAnswer?.answer || "Je partner heeft op deze dag geen antwoord gegeven.")
                        }
                    </p>
                </div>

                <div style={styles.chatContainer}>
                <div style={styles.chatBox} ref={state.chatEndRef}>
                    {chatMessages.length > 0 ? chatMessages.map((msg) => (
                    <div key={msg.id} style={{...styles.chatMessage, ...(msg.userId === currentUser.id ? styles.myMessage : styles.partnerMessage)}}>
                        <span style={styles.chatMessageContent}>{msg.message}</span>
                        <span style={styles.timestamp}>{formatTimestamp(msg.timestamp)}</span>
                    </div>
                    )) : <p style={styles.disabledText}>Geen gesprek voor deze dag.</p>}
                </div>

                {isViewingYesterday ? (
                    <div style={styles.chatInputContainer}>
                    {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
                    <Input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isSendingChat && handleSendChatMessage()}
                        placeholder="Chat over gisteren..."
                        disabled={isSendingChat}
                        maxLength={UI.CHAT_MAX_LENGTH}
                        className="flex-1"
                    />
                    <button style={styles.emojiButton} onClick={() => setShowEmojiPicker(!showEmojiPicker)}><EmojiIcon /></button>
                    <Button 
                        onClick={handleSendChatMessage} 
                        disabled={isSendingChat}
                        size="sm"
                    >
                        <SendIcon />
                    </Button>
                    </div>
                ) : (
                    <p style={styles.disabledText}>Je kunt alleen chatten over de reflectie van gisteren.</p>
                )}
                </div>
            </section>
            ) : <section style={styles.card}><p>Geen gegevens voor deze dag.</p></section>}
        </div>
      )}
    </main>
  );
};

export default MainView;
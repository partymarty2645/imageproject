import React from 'react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = ['💖', '✨', '😊', '😂', '😢', '🙏', '🥰', '🤔', '😴', '🎉'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    pickerContainer: {
      position: 'absolute',
      bottom: '100%',
      right: '0',
      marginBottom: '10px',
      backgroundColor: '#3c304f',
      borderRadius: '10px',
      padding: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      gap: '5px',
      zIndex: 10,
    },
    emojiButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.5rem',
      padding: '5px',
      borderRadius: '5px',
      transition: 'background-color 0.2s',
    },
  };

  return (
    <div style={styles.pickerContainer}>
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          style={styles.emojiButton}
          onClick={() => onEmojiSelect(emoji)}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#5a4a6b')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label={`Emoji ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default EmojiPicker;
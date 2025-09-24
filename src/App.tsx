import './App.css';

function App() {
  const today = new Date().toISOString().split('T')[0];
  const imagePath = `/images/${today}.png`;

  return (
    <div className="app">
      <header className="header">
        <h1>AI Visual Diary</h1>
        <p>Your daily AI-generated artwork</p>
      </header>
      <main className="main">
        <div className="image-container">
          <img
            src={imagePath}
            alt={`Daily artwork for ${today}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png'; // Add a placeholder image in public/images/
            }}
          />
        </div>
        <p className="date">Date: {today}</p>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import './App.css';
import SlideCreator from './components/SlideCreator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SlideMaker</h1>
        <div className="logo">SM</div>
      </header>
      <main>
        <SlideCreator />
      </main>
    </div>
  );
}

export default App;

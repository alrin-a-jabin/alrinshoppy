import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Replace a tag with Router */}
      <div class="header">
       <a href="#default" class="logo">Alrin Shoppy</a>
         <div class="header-right">
            <a class="active" href="#home">Home</a>
            <a href="#contact">Contact</a>
            <a href="#about">About</a>
         </div>
      </div> 
      <header className="App-header">
        <h1>Alrin shoppy</h1>

      </header>
    </div>
  );
}

export default App;

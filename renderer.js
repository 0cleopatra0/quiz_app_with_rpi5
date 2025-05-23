/* style.css */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #121212;
  color: #E0E0E0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 20px;
}

#app-container {
  width: 480px;
  background-color: #1E1E1E;
  border-radius: 10px;
  box-shadow: 0 0 12px rgba(0,0,0,0.7);
  padding: 30px;
}

header h1 {
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #90CAF9;
  text-align: center;
}

#image-container {
  text-align: center;
  font-size: 1.5rem;
  color: #90CAF9;
  margin-bottom: 25px;
}

.hidden {
  display: none;
}

#questions-section h2 {
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 1.3rem;
  color: #BBDEFB;
  border-bottom: 1px solid #444;
  padding-bottom: 6px;
}

#questionList {
  list-style: none;
  padding-left: 0;
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #292929;
}

#questionList li {
  padding: 10px 12px;
  border-bottom: 1px solid #3A3A3A;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

#questionList li:last-child {
  border-bottom: none;
}

#questionList li:hover {
  background-color: #3A5BB8;
  cursor: default;
  color: #E3F2FD;
}

#ask-section {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#ask-section input[type="text"] {
  padding: 10px 12px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
  color: #121212;
}

#ask-section input[type="text"]::placeholder {
  color: #666;
}

#askBtn {
  padding: 12px;
  border: none;
  background-color: #1976D2;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

#askBtn:hover {
  background-color: #115293;
}

#response {
  margin-top: 20px;
  min-height: 40px;
  font-size: 1.1rem;
  color: #A5D6A7;
  white-space: pre-wrap;
}

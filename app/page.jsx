'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = 'https://opentdb.com/api.php?amount=50&category=21&difficulty=medium&type=multiple';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(apiUrl);
        setQuestions(data.results);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer('');
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <h1 className="title">Brain Buster</h1>
      <div className="question-container">
        <p className="question">{currentQuestion.question}</p>
        <div className="options">
          <div className="row">
            {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer)
              .slice(0, 2)
              .map((answer, index) => (
                <button
                  key={index}
                  className={`option-btn ${selectedAnswer === answer ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelection(answer)}
                  disabled={isAnswered}
                >
                  {answer}
                </button>
              ))}
          </div>
          <div className="row">
            {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer)
              .slice(2, 4)
              .map((answer, index) => (
                <button
                  key={index + 2}
                  className={`option-btn ${selectedAnswer === answer ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelection(answer)}
                  disabled={isAnswered}
                >
                  {answer}
                </button>
              ))}
          </div>
        </div>
        {isAnswered && (
          <div className="feedback">
            {selectedAnswer === currentQuestion.correct_answer ? (
              <p className="correct">Correct! 😊</p>
            ) : (
              <p className="incorrect">Incorrect! The correct answer is: {currentQuestion.correct_answer}</p>
            )}
            <button className="next-btn" onClick={nextQuestion}>
              Next Question
            </button>
          </div>
        )}
        <p className="score">Score: {score}</p>
      </div>
    </div>
  );
};

export default Home;

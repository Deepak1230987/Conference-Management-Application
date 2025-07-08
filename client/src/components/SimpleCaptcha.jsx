import React, { useState, useEffect } from "react";

const SimpleCaptcha = ({ onCaptchaVerify }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  // Generate new random numbers for the CAPTCHA
  const generateCaptcha = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer("");
    setIsCorrect(null);
  };

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Verify the user's answer
  const verifyCaptcha = () => {
    const correctAnswer = num1 + num2;
    const userEnteredAnswer = parseInt(userAnswer, 10);

    if (!userAnswer || isNaN(userEnteredAnswer)) {
      setIsCorrect(false);
      onCaptchaVerify(false);
      return;
    }

    if (userEnteredAnswer === correctAnswer) {
      setIsCorrect(true);
      onCaptchaVerify(true);
    } else {
      setIsCorrect(false);
      onCaptchaVerify(false);
      // Generate new CAPTCHA on incorrect answer
      setTimeout(() => {
        generateCaptcha();
      }, 2500); // Give user time to see the error message before generating new problem
    }
  };

  return (
    <div className="my-4">
      <div className="mb-2 text-sm font-medium text-gray-700">
        Verification: Please solve this simple math problem
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div
          className={`px-4 py-2.5 border ${
            isCorrect === false
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-gray-300 bg-blue-50 text-blue-800"
          } rounded-lg text-gray-900 font-medium shadow-sm`}
        >
          {num1} + {num2} =
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className={`w-20 px-3 py-2.5 border ${
            isCorrect === false
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          } rounded-lg shadow-sm focus:outline-none`}
          placeholder="?"
        />
        <button
          type="button"
          onClick={verifyCaptcha}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm transition-colors font-medium"
        >
          Verify
        </button>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          title="New problem"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isCorrect === false && (
        <div className="mt-3 flex items-start p-3 bg-red-50 border border-red-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-red-700">
            Incorrect answer. Please try again with the new problem.
          </p>
        </div>
      )}
      {isCorrect === true && (
        <div className="mt-3 flex items-start p-3 bg-green-50 border border-green-100 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-green-700">
            Correct! You can proceed with your submission.
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleCaptcha;

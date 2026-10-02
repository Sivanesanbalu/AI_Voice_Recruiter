import React from 'react';

function QuestionListContainer({ questionList }) {
  return (
    <div>
      <h2 className='font-bold text-lg mt-5'>Generated Interview Questions:</h2>
      {questionList.length === 0 ? (
        <p className="text-gray-500">No questions generated.</p>
      ) : (
        questionList.map((q, index) => (
          <div
            key={index}
            className="bg-white border rounded-md p-4 shadow-sm mt-2"
          >
            <strong>Q{index + 1}:</strong> {q?.question || 'No question provided'}
            <p className="text-sm text-blue-600 mt-1">
              Type: {q?.type || 'Unknown'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default QuestionListContainer;

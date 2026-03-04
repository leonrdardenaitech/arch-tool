import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini'; // Importing the Brain

const Refiner = () => {
  const [input, setInput] = useState('');
  const { refinePrompt, loading } = useGemini(); // Grabbing the logic
  const [result, setResult] = useState('');

  const handleRefine = async () => {
    const refinedText = await refinePrompt(input);
    setResult(refinedText);
  };

  return (
    <div className="p-6 bg-opacity-20 bg-green-400 rounded-xl border border-green-500 shadow-lg backdrop-blur-md transition-all">
      <h2 className="text-2xl font-bold text-green-300 mb-4">Refiner 5.0</h2>
      <textarea 
        className="w-full p-3 bg-black text-green-400 border border-green-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        rows="4"
        placeholder="Drop your thoughts into the slime..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button 
        onClick={handleRefine}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-all disabled:opacity-50"
      >
        {loading ? 'Refining...' : 'Refine Prompt'}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-900 bg-opacity-40 border border-green-400 rounded-lg text-green-100">
          <p className="italic">"The Ooze provides:"</p>
          <p className="mt-2">{result}</p>
        </div>
      )}
    </div>
  );
};

export default Refiner;
// PredictionHistory.tsx
import React from 'react';

interface HistoryEntry {
  prediction: string;
  timestamp: string;
  confidences?: Record<string, number>;
}

interface PredictionHistoryProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history, onRestore }) => {
  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-2">Prediction History</h4>
      {history.length === 0 ? (
        <p className="text-gray-500">No predictions yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((entry, index) => (
            <li
              key={index}
              onClick={() => onRestore(entry)}
              className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded cursor-pointer shadow-sm transition-transform transform hover:scale-105"
              style={{ animation: `slideIn 0.3s ease ${index * 0.1}s`, animationFillMode: 'forwards', opacity: 0 }}
            >
              🧠 <strong>{entry.prediction}</strong> — <span className="text-sm">{entry.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PredictionHistory;
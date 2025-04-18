import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PredictionHistory from './PredictionHistory';

const EEGInputForm: React.FC = () => {
  const [features, setFeatures] = useState<number[]>(Array(54).fill(0));
  const [result, setResult] = useState<string | null>(null);
  const [confidences, setConfidences] = useState<Record<string, number> | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [confidencePercent, setConfidencePercent] = useState<number>(0);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [selectedFileName, setSelectedFileName] = useState("No file chosen");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("result");
    const savedConfidences = localStorage.getItem("confidences");
    const savedHistory = localStorage.getItem("history");
    const savedFeatures = localStorage.getItem("features");

    if (savedResult) setResult(savedResult);
    if (savedConfidences) {
      const parsed = JSON.parse(savedConfidences);
      setConfidences(parsed);
      const max = Math.max(...(Object.values(parsed) as number[]));
      setConfidencePercent(Math.round(max * 100));
    }
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      setTotal(parsed.length);
    }
    if (savedFeatures) setFeatures(JSON.parse(savedFeatures));
  }, []);

  const handleChange = (index: number, value: number) => {
    const updated = [...features];
    updated[index] = isNaN(value) ? 0 : value;
    setFeatures(updated);
    localStorage.setItem("features", JSON.stringify(updated));
  };

  const handleReset = () => {
    const cleared = Array(54).fill(0);
    setFeatures(cleared);
    setResult(null);
    setConfidences(null);
    setConfidencePercent(0);
    setProcessingTime(0);
    localStorage.removeItem("result");
    localStorage.removeItem("confidences");
    localStorage.removeItem("features");
    setSelectedFileName("No file chosen");
  };

  const handleClearAll = () => {
    setFeatures(Array(54).fill(0));
    setResult(null);
    setConfidences(null);
    setHistory([]);
    setTotal(0);
    setConfidencePercent(0);
    setProcessingTime(0);
    const darkMode = localStorage.getItem("darkMode");
    localStorage.clear();
    if (darkMode) localStorage.setItem("darkMode", darkMode);
    setSelectedFileName("No file chosen");
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string).trim();
      const values = text.split(',').map(Number);
      if (values.length === 54 && values.every(v => !isNaN(v))) {
        setFeatures(values);
        localStorage.setItem("features", JSON.stringify(values));
      } else {
        alert("CSV must contain exactly 54 numeric values in a single row.");
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    // Check for invalid values before submitting
    if (features.length !== 54 || features.some((val) => isNaN(val))) {
      alert("Please make sure all 54 features are filled in with valid numbers.");
      return;
    }
  
    const payload: Record<string, number> = {};
    features.forEach((val, i) => {
      payload[`feature${i}`] = val;
    });
  
    console.log("Submitting payload:", payload); // Inspect in browser console
  
    const start = performance.now();
    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText}`);
      }
  
      const data = await res.json();
      const end = performance.now();
      const timeTaken = Math.round(end - start);
  
      setResult(data.prediction);
      setConfidences(data.confidences || null);
      setProcessingTime(timeTaken);
      setConfidencePercent(Math.round(Math.max(...(Object.values(data.confidences || {}) as number[])) * 100));
  
      localStorage.setItem("result", data.prediction);
      localStorage.setItem("confidences", JSON.stringify(data.confidences || {}));
  
      const timestamp = new Date().toLocaleString();
      const newEntry = {
        prediction: data.prediction,
        timestamp,
        confidences: data.confidences
      };
      const updatedHistory = [...history, newEntry];
      setHistory(updatedHistory);
      setTotal(updatedHistory.length);
      localStorage.setItem("history", JSON.stringify(updatedHistory));
  
    } catch (err: any) {
      console.error("Prediction failed:", err.message);
      alert("Prediction failed: " + err.message);
      setResult("Prediction failed.");
    }
  };
  

  const restoreFromHistory = (entry: any) => {
    setResult(entry.prediction);
    setConfidences(entry.confidences || null);
    if (entry.confidences) {
      const max = Math.max(...(Object.values(entry.confidences) as number[]));
      setConfidencePercent(Math.round(max * 100));
    }
  };

  const chartData = confidences
    ? Object.entries(confidences).map(([label, score]) => ({
        label,
        confidence: Math.round(score * 100),
      }))
    : [];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">EEG Data Input</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              📁 Choose File
            </button>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{selectedFileName}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </div>
          <button onClick={handleReset} className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition">
            🔄 Reset Inputs
          </button>
          <button onClick={handleClearAll} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
            🧹 Clear All
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {features.map((val, i) => (
          <input
            key={i}
            type="number"
            value={val}
            placeholder={`F${i}`}
            onChange={(e) => handleChange(i, parseFloat(e.target.value) || 0)} // Updated to prevent invalid numbers
            className="border p-1 rounded text-sm text-center dark:bg-gray-700 dark:border-gray-600"
          />
        ))}
      </form>

      <div className="text-center">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105"
          onClick={handleSubmit}
        >
          ⚡ Predict
        </button>
      </div>

      {result && (
        <div className="text-center text-lg text-gray-800 dark:text-gray-200">
          Predicted: <strong>{result}</strong>
        </div>
      )}

      {confidences && (
        <div className="mt-8 h-72">
          <h4 className="text-center mb-2 font-semibold">Confidence Scores</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="confidence" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <PredictionHistory history={history} onRestore={restoreFromHistory} />
    </div>
  );
};

export default EEGInputForm;

import React, { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import Header from './Header';
import EEGInputForm from './EEGInputForm';
import StatCards from './StatCards';
import PredictionHistory from './PredictionHistory';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard: React.FC = () => {
  // Removed unused state 'collapsed'
  const [darkMode, setDarkMode] = useState(false);
  // Removed unused 'features' state
  const [confidences, setConfidences] = useState<Record<string, number> | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [processingTime] = useState<number>(0);
  const [confidencePercent, setConfidencePercent] = useState<number>(0);

  useEffect(() => {
    const saved = {
      result: localStorage.getItem("result"),
      confidences: localStorage.getItem("confidences"),
      features: localStorage.getItem("features"),
      history: localStorage.getItem("history"),
    };

    // Removed unused 'features' state handling
    if (saved.confidences) {
      const parsed = JSON.parse(saved.confidences || "{}");
      setConfidences(parsed);
      setConfidencePercent(Math.round(Math.max(...(Object.values(parsed) as number[])) * 100));
    }
    if (saved.history) setHistory(JSON.parse(saved.history || "[]"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const chartData =
    confidences &&
    Object.entries(confidences).map(([label, score]) => ({
      label,
      confidence: Math.round(score * 100),
    }));

  return (
    <div className={`flex h-screen ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
          handleLogout={handleLogout} 
        />

        <main className="p-6 overflow-y-auto space-y-6">
          <h1 className="text-2xl font-bold">EEG Prediction Dashboard</h1>

          <StatCards 
            total={history.length}
            confidencePercent={confidencePercent}
            processingTime={processingTime}
          />

          <EEGInputForm />
          {chartData && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow h-[300px] animate-slideInRight">
              <h3 className="text-lg mb-2">Confidence Scores</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="confidence" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <PredictionHistory 
            history={history} 
            onRestore={(entry) => {
              // Implement the restore logic here
              console.log("Restoring entry:", entry);
            }} 
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

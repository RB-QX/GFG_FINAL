import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Login from './Login.tsx';
import Signup from './SignUp.tsx';
import Dashboard from './Dashboard'; // ✅ Import EEG Dashboard
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import AuthRoute from "./AuthRoute";

const firebaseConfig = {
  apiKey: "AIzaSyBg78xiouB8KqVFYfTu5XXgoi4rB0zyxk8",
  authDomain: "authentication-b878b.firebaseapp.com",
  projectId: "authentication-b878b",
  storageBucket: "authentication-b878b.firebasestorage.app",
  messagingSenderId: "957623390606",
  appId: "1:957623390606:web:037f6e370d61755f0694df",
  measurementId: "G-TQ1WS2ZTRT"
};

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthRoute><App /></AuthRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

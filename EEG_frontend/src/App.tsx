import { Navigate } from "react-router-dom";

function App() {
  // Replace with real logic to check authentication status
  const isLoggedIn = true;

  // Redirect users based on auth status
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default App;

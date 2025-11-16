export const initializeToken = () => {
  try {
    const stored = localStorage.getItem("access_token");
    if (stored) {
      currentToken = stored;
    }
  } catch (error) {
    console.error("Error initializing token from localStorage:", error);
  }
};

let currentToken = null;

export const setCurrentToken = (token) => {
  currentToken = token;
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
};

export const getCurrentToken = () => {
  if (currentToken) {
    return currentToken;
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem("access_token");
    if (stored) {
      currentToken = stored;
      return stored;
    }
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
  }

  return null;
};

export const clearToken = () => {
  currentToken = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
};

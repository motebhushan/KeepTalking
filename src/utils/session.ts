const SESSION_KEY = 'english-talk-buddy-session-id';

export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};
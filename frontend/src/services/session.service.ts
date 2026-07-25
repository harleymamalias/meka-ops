import type { AuthSession } from '@/features/auth/types';

let activeSession: AuthSession | null = null;

export const sessionService = {
  get() {
    return activeSession;
  },
  set(session: AuthSession) {
    activeSession = session;
  },
  updateTokens(tokens: Pick<AuthSession, 'accessToken' | 'refreshToken'>) {
    if (!activeSession) {
      return;
    }

    activeSession = { ...activeSession, ...tokens };
  },
  clear() {
    activeSession = null;
  },
};

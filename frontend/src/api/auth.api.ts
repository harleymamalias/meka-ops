import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
} from '@/features/auth/types';
import { httpApi } from './http.api';

export function login(payload: LoginPayload) {
  return httpApi.post<AuthSession>('/auth/login', payload, {
    authenticated: false,
  });
}

export function registerAccount(payload: RegisterPayload) {
  return httpApi.post<AuthSession>('/auth/register', payload, {
    authenticated: false,
  });
}

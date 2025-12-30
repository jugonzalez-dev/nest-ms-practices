/**
 * Port (Interface) para el proveedor de autenticación SSO
 * Define el contrato que debe cumplir cualquier implementación de SSO
 */
export interface AuthProviderPort {
  /**
   * Valida un token de acceso
   * @param token Token JWT o token de acceso
   * @returns Información del usuario autenticado
   */
  validateToken(token: string): Promise<UserInfo>;

  /**
   * Obtiene información del usuario desde el proveedor SSO
   * @param accessToken Token de acceso
   * @returns Información del usuario
   */
  getUserInfo(accessToken: string): Promise<UserInfo>;

  /**
   * Inicia el flujo de autenticación OAuth2
   * @returns URL de autorización
   */
  getAuthorizationUrl(): string;

  /**
   * Intercambia un código de autorización por un token de acceso
   * @param code Código de autorización
   * @returns Token de acceso y refresh token
   */
  exchangeCodeForToken(code: string): Promise<TokenResponse>;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  [key: string]: any;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}


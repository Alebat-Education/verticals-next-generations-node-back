import bcrypt from 'bcrypt';
import { AUTH_CONFIG } from '@constants/auth/auth.js';

/**
 * Hashea una contraseña utilizando bcrypt.
 * @param password - La contraseña en texto plano a hashear.
 * @return La contraseña hasheada.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, AUTH_CONFIG.BCRYPT_SALT_ROUNDS);
};

/**
 * Compara la contraseña en texto plano con su hash.
 * @param password - La contraseña en texto plano.
 * @param hash - Hash de la contraseña almacenada.
 * @return Verdadero si coinciden, falso en caso contrario.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

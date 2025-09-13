export const authConfig = {
  JWT_SECRET: (() => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Se requiere la variable de entorno JWT_SECRET.');
    }
    return secret;
  })(),
  JWT_EXPIRATION: '24h',
  BCRYPT_ROUNDS: 12, // Aumentado para mejor seguridad
};

export const VALID_ROLES = ['admin', 'vet', 'assistant'] as const;
export type UserRole = typeof VALID_ROLES[number];

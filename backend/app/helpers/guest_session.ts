import encryption from '@adonisjs/core/services/encryption'
import string from '@adonisjs/core/helpers/string'

export const createGuestSession = async () => {
  const session = encryption.encrypt(string.random(32), undefined, 'guest_session')

  return session
}

export const verifyGuestSession = async (session: string) => {
  const decrypted = await encryption.decrypt(session, 'guest_session')

  return typeof decrypted === 'string' && decrypted.length === 32
}

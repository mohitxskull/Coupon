import string from '@adonisjs/core/helpers/string'

export const setting = {
  signIn: {
    enabled: true,
  },

  passwordRequirement: {
    crackTime: string.seconds.parse('1 year')!,
    score: 3,
    size: {
      min: 8,
      max: 32,
    },
  },
}

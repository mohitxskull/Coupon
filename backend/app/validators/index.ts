import { setting } from '#config/setting'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const NameSchema = vine.string().minLength(2).maxLength(100)

export const GmailSchema = vine.string().email({
  host_whitelist: ['gmail.com'],
})

export const PasswordSchema = vine
  .string()
  .minLength(setting.passwordRequirement.size.min)
  .maxLength(setting.passwordRequirement.size.max)

export const CouponTitleSchema = vine.string().minLength(1).maxLength(20)

export const CouponDescriptionSchema = vine.string().minLength(1).maxLength(200)

export const CouponCodeSchema = vine.string().minLength(6).maxLength(10)

export const CouponExpiresAtSchema = vine
  .date({ formats: ['iso8601'] })
  .after('today')
  .nullable()
  .optional()
  .transform((value) => {
    if (!value) return null
    return DateTime.fromJSDate(value).toUTC()
  })

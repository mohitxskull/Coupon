import factory from '@adonisjs/lucid/factories'
import Coupon from '#models/coupon'
import stringHelpers from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'

export const CouponFactory = factory
  .define(Coupon, async ({ faker }) => {
    return {
      title: faker.lorem.words(2),
      description: faker.lorem.sentences(2),
      code: stringHelpers.random(10),
      isActive: true,
      expiresAt:
        Math.random() > 0.5
          ? DateTime.now().plus({ days: faker.number.int({ min: 2, max: 15 }) })
          : null,
    }
  })
  .build()

import Coupon from '#models/coupon'
import stringHelpers from '@adonisjs/core/helpers/string'
import { handler } from '@folie/castle/helpers'

export default class Controller {
  handle = handler(async () => {
    const coupon = await Coupon.create({
      title: 'Untitled',
      code: stringHelpers.random(10),
      isActive: false,
      expiresAt: null,
    })

    return { coupon: coupon.$serialize(), message: 'Coupon created successfully' }
  })
}

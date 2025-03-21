import { squid } from '#config/squid'
import Coupon from '#models/coupon'
import { ProcessingException } from '@folie/castle/exception'
import { handler } from '@folie/castle/helpers'
import vine from '@vinejs/vine'

export default class Controller {
  input = vine.compile(
    vine.object({
      params: vine.object({
        couponId: squid.coupon.schema,
      }),
    })
  )

  handle = handler(async ({ ctx }) => {
    const payload = await ctx.request.validateUsing(this.input)

    const coupon = await Coupon.find(payload.params.couponId)

    if (!coupon) {
      throw new ProcessingException('Coupon not found', {
        status: 'NOT_FOUND',
      })
    }

    return { coupon: coupon.$serialize() }
  })
}

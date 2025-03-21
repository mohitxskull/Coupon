import { squid } from '#config/squid'
import Coupon from '#models/coupon'
import {
  CouponCodeSchema,
  CouponDescriptionSchema,
  CouponExpiresAtSchema,
  CouponTitleSchema,
} from '#validators/index'
import { ProcessingException } from '@folie/castle/exception'
import { handler } from '@folie/castle/helpers'
import vine from '@vinejs/vine'

export default class Controller {
  input = vine.compile(
    vine.object({
      params: vine.object({
        couponId: squid.coupon.schema,
      }),
      title: CouponTitleSchema.optional(),
      description: CouponDescriptionSchema.optional(),
      code: CouponCodeSchema.optional(),
      expiresAt: CouponExpiresAtSchema,
      isActive: vine.boolean().optional(),
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

    if (payload.title) {
      coupon.title = payload.title
    }

    if (payload.description) {
      coupon.description = payload.description
    }

    if (payload.isActive !== undefined) {
      coupon.isActive = payload.isActive
    }

    if (payload.code) {
      coupon.code = payload.code
    }

    if (payload.expiresAt !== undefined) {
      coupon.expiresAt = payload.expiresAt
    }

    await coupon.save()

    return { coupon: coupon.$serialize(), message: `Coupon "${coupon.title}" updated successfully` }
  })
}

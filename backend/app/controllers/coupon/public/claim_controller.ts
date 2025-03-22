import { decryptGuestSession } from '#helpers/guest_session'
import Coupon from '#models/coupon'
import locks from '@adonisjs/lock/services/main'
import { ProcessingException } from '@folie/castle/exception'
import { handler } from '@folie/castle/helpers'
import { getBearerToken } from '@folie/castle/helpers'
import { pick } from '@folie/lib'
import vine from '@vinejs/vine'

export default class Controller {
  input = vine.compile(
    vine.object({
      name: vine.string().minLength(2).maxLength(20),
    })
  )

  handle = handler(async ({ ctx }) => {
    const token = getBearerToken(ctx)

    if (!token) {
      throw new ProcessingException('Unauthorized', {
        status: 'UNAUTHORIZED',
      })
    }

    const payload = await ctx.request.validateUsing(this.input)

    const userId = await decryptGuestSession(token)

    if (!userId) {
      throw new ProcessingException('Unauthorized', {
        status: 'UNAUTHORIZED',
      })
    }

    const alreadyClaimed = await Coupon.query()
      .where('isActive', true)
      .andWhere('user', userId)
      .first()

    if (alreadyClaimed) {
      throw new ProcessingException('Coupon already claimed', {
        status: 'CONFLICT',
      })
    }

    const lock = locks.createLock('coupon-claim')

    const acquired = await lock.acquireImmediately()

    if (!acquired) {
      throw new ProcessingException('Try again later, other users are claiming a coupon', {
        status: 'CONFLICT',
      })
    }

    /**
     * Lock has been acquired. We can process the order
     */
    try {
      const coupon = await Coupon.query()
        .where('isActive', true)
        .andWhereNull('claimedAt')
        .orderBy('createdAt', 'desc')
        .first()

      if (!coupon) {
        throw new ProcessingException('Coupon not found', {
          status: 'NOT_FOUND',
        })
      }

      coupon.user = userId
      coupon.userIp = ctx.request.ip()
      coupon.userDetail = {
        name: payload.name,
      }

      await coupon.save()

      return { coupon: pick(coupon.$serialize(), ['code', 'expiresAt', 'title', 'description']) }
    } finally {
      await lock.release()
    }
  })
}

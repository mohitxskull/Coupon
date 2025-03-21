import { verifyGuestSession } from '#helpers/guest_session'
import Coupon from '#models/coupon'
import locks from '@adonisjs/lock/services/main'
import { ProcessingException } from '@folie/castle/exception'
import { handler } from '@folie/castle/helpers'
import { getBearerToken } from '@folie/castle/helpers'
import { pick } from '@folie/lib'

export default class Controller {
  handle = handler(async ({ ctx }) => {
    const token = getBearerToken(ctx)

    if (!token) {
      throw new ProcessingException('Unauthorized', {
        status: 'UNAUTHORIZED',
      })
    }

    if (!(await verifyGuestSession(token))) {
      throw new ProcessingException('Unauthorized', {
        status: 'UNAUTHORIZED',
      })
    }

    const lock = locks.createLock('coupon-claim')

    const acquired = await lock.acquireImmediately()

    if (!acquired) {
      throw new ProcessingException('', {
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

      coupon.claimedBy = token
      coupon.ip = ctx.request.ip()

      await coupon.save()

      return { coupon: pick(coupon.$serialize(), ['code', 'expiresAt', 'title', 'description']) }
    } finally {
      await lock.release()
    }
  })
}

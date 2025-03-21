import { verifyGuestSession } from '#helpers/guest_session'
import Coupon from '#models/coupon'
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

    const coupon = await Coupon.query().where('isActive', true).andWhere('claimedBy', token).first()

    if (!coupon) {
      throw new ProcessingException('Coupon not found', {
        status: 'NOT_FOUND',
      })
    }

    return { coupon: pick(coupon.$serialize(), ['code', 'expiresAt', 'title', 'description']) }
  })
}

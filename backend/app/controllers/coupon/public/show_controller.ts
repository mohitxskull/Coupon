import { decryptGuestSession } from '#helpers/guest_session'
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

    const userId = await decryptGuestSession(token)

    if (!userId) {
      throw new ProcessingException('Unauthorized', {
        status: 'UNAUTHORIZED',
      })
    }

    const coupon = await Coupon.query()
      .where('isActive', true)
      .andWhere('claimedBy', userId)
      .first()

    if (!coupon) {
      throw new ProcessingException('Coupon not found', {
        status: 'NOT_FOUND',
      })
    }

    const serializedCoupon = coupon.$serialize()

    return {
      coupon: pick({ ...serializedCoupon, name: serializedCoupon.userDetail?.name }, [
        'code',
        'expiresAt',
        'title',
        'description',
        'name',
      ]),
    }
  })
}

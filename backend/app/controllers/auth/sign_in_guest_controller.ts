import { handler } from '@folie/castle/helpers'
import { createGuestSession } from '#helpers/guest_session'

export default class Controller {
  handle = handler(async () => {
    const session = await createGuestSession()

    return { session }
  })
}

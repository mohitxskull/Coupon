/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { claimThrottle, signInThrottle, throttle } from './limiter.js'
import { ProcessingException } from '@folie/castle/exception'

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router
              .get('session', [() => import('#controllers/auth/session_controller')])
              .use(middleware.auth())

            router
              .post('sign-out', [() => import('#controllers/auth/sign_out_controller')])
              .use(middleware.auth())

            router
              .post('sign-in', [() => import('#controllers/auth/sign_in_controller')])
              .use([signInThrottle, middleware.captcha()])

            router.post('sign-in-guest', [
              () => import('#controllers/auth/sign_in_guest_controller'),
            ])

            router
              .group(() => {
                router.put('', [() => import('#controllers/auth/password/update_controller')])
              })
              .prefix('password')
              .use(middleware.auth())

            router
              .group(() => {
                router.put('', [() => import('#controllers/auth/profile/update_controller')])
              })
              .prefix('profile')
              .use(middleware.auth())
          })
          .prefix('auth')

        router
          .group(() => {
            router
              .group(() => {
                router
                  .post('claim', [() => import('#controllers/coupon/public/claim_controller')])
                  .use([claimThrottle, middleware.captcha()])

                router.get('', [() => import('#controllers/coupon/public/show_controller')])
              })
              .prefix('public')

            router
              .group(() => {
                router.get('', [() => import('#controllers/coupon/list_controller')])

                router.get(':couponId', [() => import('#controllers/coupon/show_controller')])

                router.post('', [() => import('#controllers/coupon/create_controller')])

                router.put(':couponId', [() => import('#controllers/coupon/update_controller')])

                router.delete(':couponId', [() => import('#controllers/coupon/delete_controller')])
              })
              .use(middleware.auth())
          })
          .prefix('coupon')

        router.get('ping', [() => import('#controllers/ping_controller')])
      })
      .prefix('v1')
  })
  .prefix('api')
  .use(throttle)

router
  .any('*', (ctx) => {
    throw new ProcessingException('Route not found', {
      status: 'NOT_FOUND',
      meta: {
        public: {
          route: ctx.request.url(),
          method: ctx.request.method(),
        },
      },
    })
  })
  .use(throttle)

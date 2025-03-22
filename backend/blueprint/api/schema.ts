/// <reference path="../reference.ts" />

import { InferController, endpoint } from '@folie/blueprint-lib'

/*
 * This is an auto-generated file. Changes made to this file will be lost.
 * Run `nr ace blueprint:generate` to update it.
 */

export type V1AuthSessionRoute = InferController<
  (typeof import('../../app/controllers/auth/session_controller.ts'))['default']
>
export type V1AuthSignOutRoute = InferController<
  (typeof import('../../app/controllers/auth/sign_out_controller.ts'))['default']
>
export type V1AuthSignInRoute = InferController<
  (typeof import('../../app/controllers/auth/sign_in_controller.ts'))['default']
>
export type V1AuthSignInGuestRoute = InferController<
  (typeof import('../../app/controllers/auth/sign_in_guest_controller.ts'))['default']
>
export type V1AuthPasswordUpdateRoute = InferController<
  (typeof import('../../app/controllers/auth/password/update_controller.ts'))['default']
>
export type V1AuthProfileUpdateRoute = InferController<
  (typeof import('../../app/controllers/auth/profile/update_controller.ts'))['default']
>
export type V1CouponListRoute = InferController<
  (typeof import('../../app/controllers/coupon/list_controller.ts'))['default']
>
export type V1CouponShowRoute = InferController<
  (typeof import('../../app/controllers/coupon/show_controller.ts'))['default']
>
export type V1CouponCreateRoute = InferController<
  (typeof import('../../app/controllers/coupon/create_controller.ts'))['default']
>
export type V1CouponUpdateRoute = InferController<
  (typeof import('../../app/controllers/coupon/update_controller.ts'))['default']
>
export type V1CouponDeleteRoute = InferController<
  (typeof import('../../app/controllers/coupon/delete_controller.ts'))['default']
>
export type V1CouponPublicClaimRoute = InferController<
  (typeof import('../../app/controllers/coupon/public/claim_controller.ts'))['default']
>
export type V1CouponPublicShowRoute = InferController<
  (typeof import('../../app/controllers/coupon/public/show_controller.ts'))['default']
>
export type V1PingRoute = InferController<
  (typeof import('../../app/controllers/ping_controller.ts'))['default']
>

export const endpoints = {
  V1_AUTH_SESSION: endpoint<V1AuthSessionRoute>({
    form: false,
    url: '/api/v1/auth/session',
    method: 'GET',
  }),
  V1_AUTH_SIGN_OUT: endpoint<V1AuthSignOutRoute>({
    form: false,
    url: '/api/v1/auth/sign-out',
    method: 'POST',
  }),
  V1_AUTH_SIGN_IN: endpoint<V1AuthSignInRoute>({
    form: false,
    url: '/api/v1/auth/sign-in',
    method: 'POST',
  }),
  V1_AUTH_SIGN_IN_GUEST: endpoint<V1AuthSignInGuestRoute>({
    form: false,
    url: '/api/v1/auth/sign-in-guest',
    method: 'POST',
  }),
  V1_AUTH_PASSWORD_UPDATE: endpoint<V1AuthPasswordUpdateRoute>({
    form: false,
    url: '/api/v1/auth/password',
    method: 'PUT',
  }),
  V1_AUTH_PROFILE_UPDATE: endpoint<V1AuthProfileUpdateRoute>({
    form: false,
    url: '/api/v1/auth/profile',
    method: 'PUT',
  }),
  V1_COUPON_LIST: endpoint<V1CouponListRoute>({
    form: false,
    url: '/api/v1/coupon',
    method: 'GET',
  }),
  V1_COUPON_SHOW: endpoint<V1CouponShowRoute>({
    form: false,
    url: '/api/v1/coupon/{{ couponId }}',
    method: 'GET',
  }),
  V1_COUPON_CREATE: endpoint<V1CouponCreateRoute>({
    form: false,
    url: '/api/v1/coupon',
    method: 'POST',
  }),
  V1_COUPON_UPDATE: endpoint<V1CouponUpdateRoute>({
    form: false,
    url: '/api/v1/coupon/{{ couponId }}',
    method: 'PUT',
  }),
  V1_COUPON_DELETE: endpoint<V1CouponDeleteRoute>({
    form: false,
    url: '/api/v1/coupon/{{ couponId }}',
    method: 'DELETE',
  }),
  V1_COUPON_PUBLIC_CLAIM: endpoint<V1CouponPublicClaimRoute>({
    form: false,
    url: '/api/v1/coupon/public/claim',
    method: 'POST',
  }),
  V1_COUPON_PUBLIC_SHOW: endpoint<V1CouponPublicShowRoute>({
    form: false,
    url: '/api/v1/coupon/public',
    method: 'GET',
  }),
  V1_PING: endpoint<V1PingRoute>({ form: false, url: '/api/v1/ping', method: 'GET' }),
} as const

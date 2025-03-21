import vine from '@vinejs/vine'
import { PageSchema, LimitSchema, OrderSchema } from '@folie/castle/validator'
import { handler, serializePage } from '@folie/castle/helpers'
import { CouponTitleSchema } from '#validators/index'
import Coupon from '#models/coupon'

export default class Controller {
  input = vine.compile(
    vine.object({
      query: vine
        .object({
          page: PageSchema.optional(),
          limit: LimitSchema.optional(),

          order: OrderSchema('createdAt', 'updatedAt', 'title', 'id').optional(),

          filter: vine
            .object({
              value: CouponTitleSchema.optional(),
              claimed: vine.boolean().optional(),
            })
            .optional(),
        })
        .optional(),
    })
  )

  handle = handler(async ({ ctx }) => {
    const payload = await ctx.request.validateUsing(this.input)

    // Start building the query to fetch tags
    let listQuery = Coupon.query()

    if (payload.query?.filter?.claimed) {
      listQuery = listQuery.andWhereNotNull('claimedAt')
    } else {
      listQuery = listQuery.andWhereNull('claimedAt')
    }

    // Filter by note title if provided
    if (payload.query?.filter?.value) {
      listQuery = listQuery.andWhereLike('title', `%${payload.query.filter.value}%`)
    }

    // Execute the query and paginate results
    const list = await listQuery
      .orderBy(payload.query?.order?.by ?? 'createdAt', payload.query?.order?.dir ?? 'desc')
      .paginate(payload.query?.page ?? 1, payload.query?.limit ?? 10)

    return serializePage(list, (d) => d.$serialize())
  })
}

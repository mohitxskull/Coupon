import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { squid } from '#config/squid'
import cache from '@adonisjs/cache/services/main'
import { castle } from '#config/castle'
import { serializeDT } from '@folie/castle/helpers'
import { ModelCache } from '@folie/castle'
import { JSONColumn } from '@folie/castle/column'

export default class Coupon extends BaseModel {
  static table = castle.table.coupon()

  // Serialize =============================

  static $serialize(row: Coupon) {
    return {
      ...row.$toJSON(),

      id: squid.coupon.encode(row.id),

      createdAt: serializeDT(row.createdAt),
      updatedAt: serializeDT(row.updatedAt),
      claimedAt: serializeDT(row.claimedAt),
      expiresAt: serializeDT(row.expiresAt),
    }
  }

  $serialize() {
    return Coupon.$serialize(this)
  }

  $toJSON() {
    return {
      id: this.id,

      isActive: this.isActive,

      title: this.title,
      description: this.description,

      code: this.code,

      user: this.user,
      userIp: this.userIp,
      userDetail: this.userDetail,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      claimedAt: this.claimedAt,
      expiresAt: this.expiresAt,
    }
  }

  // Cache =============================

  static $cache() {
    return new ModelCache(Coupon, cache.namespace(this.table), ['metric'])
  }

  $cache() {
    return Coupon.$cache().row(this)
  }

  // Columns =============================

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isActive: boolean

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare code: string

  @column()
  declare user: string | null

  @column()
  declare userIp: string | null

  @column(JSONColumn())
  declare userDetail: {
    name?: string
  } | null

  // DateTime =============================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column.dateTime()
  declare claimedAt: DateTime | null

  // Hooks =============================

  // Relations =============================

  // Extra ======================================
}

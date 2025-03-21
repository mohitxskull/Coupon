import { castle } from '#config/castle'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = castle.table.coupon()

  async up() {
    this.schema.createTable(this.tableName, (t) => {
      t.increments('id')

      t.boolean('is_active').notNullable().defaultTo(false)

      t.string('title').notNullable()

      t.text('description')

      t.string('code').unique().notNullable()

      t.string('claimed_by').unique().nullable()
      t.string('ip').nullable()

      t.timestamp('created_at')
      t.timestamp('updated_at')
      t.timestamp('expires_at').nullable()
      t.timestamp('claimed_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

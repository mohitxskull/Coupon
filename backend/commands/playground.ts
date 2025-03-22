import { CouponFactory } from '#database/factories/coupon_factory'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class Playground extends BaseCommand {
  static commandName = 'playground'
  static description = 'Playground for your application'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Welcome to playground!')

    await CouponFactory.createMany(5)

    this.logger.info('Coupons created')
  }
}

const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class GiftCreditActions
 * @classdesc Actions GiftCreditActions
 */
class GiftCreditActions {
  /**
   * send giftCredit
   * @param {*} data
   * @param {*} reply
   * @returns
   */
  async sendGiftCredit (data, reply) {
    const filter = {
      profileId: data._user.managerId,
      gymId: data._user.profileId,
      creditAmount: data.creditAmount,
      expiryDate: data.expiryDate
    }
    const giftCredit = await ctr.giftCredit.sendGiftCredit(filter)
    return reply.cwSendSuccess({
      data: giftCredit
    })
  }
}

module.exports = GiftCreditActions

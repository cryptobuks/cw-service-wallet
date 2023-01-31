const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class TransactionActions
 * @classdesc Actions Transaction
 */
class TransactionActions {
  /**
   * get transactions
   * @param {*} data
   * @param {*} reply
   * @returns
   */
  async getTransactions (data, reply) {
    const filter = {
      profileId: data._user.managerId,
      ownerId: data._user.profileId
    }
    const transactions = await ctr.transaction.getTransactions(filter, data.limit, data.page)
    return reply.cwSendSuccess({
      data: transactions
    })
  }
}

module.exports = TransactionActions

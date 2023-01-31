const { ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class WalletActions
 * @classdesc Actions Wallet
 */
class WalletActions {
  /**
   *  Get the wallet of a user
   * @param {*} data
   * @param {*} reply
   * @returns
   */
  async getWallet (data, reply) {
    const { _user, profileId, gymId } = data
    const wallet = await ctr.wallet.getWallet({ _user, profileId, gymId })
    if (!wallet) {
      return reply.cwSendFail({
        message: 'not_authorized'
      })
    }
    return reply.cwSendSuccess({
      data: {
        wallet
      }
    })
  }
}

module.exports = WalletActions

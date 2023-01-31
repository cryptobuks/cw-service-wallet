const { db } = require('@cowellness/cw-micro-service')()

/**
 * @class WalletController
 * @classdesc Controller Wallet
 */
class WalletController {
  constructor () {
    this.Wallet = db.data.model('Wallet')
  }

  /**
  * Get wallet
  * @param {Object} param
  * @returns
  */
  async getWallet ({ _user, profileId, gymId }) {
    if (_user.profileId === profileId || _user.profileId === gymId) {
      return this.findOrCreate(profileId, gymId)
    }
    return null
  }

  /**
   * Creates a wallet if not found
   * @param {*} profileId
   * @param {*} gymId
   * @returns wallet model
   */
  async findOrCreate (profileId, gymId) {
    const wallet = await this.findWallet({ profileId, gymId })

    if (wallet) {
      return wallet
    }
    await this.create({
      profileId,
      ownerId: gymId
    })
    return this.findWallet({ profileId, gymId })
  }

  /**
   * findWallet - find a particular wallet
   * @param {Object} param
   */
  findWallet ({ gymId, profileId }) {
    return this.Wallet.findOne({ ownerId: gymId, profileId }).lean().exec()
  }

  /**
   * Create a wallet entry
   * @param {Object} data
   * @returns
   */
  create (data) {
    return this.Wallet.create(data)
  }

  /**
   * updateWalletBalance - update the balance of a wallet
   * @param {Object} param
   */
  async updateWalletBalance ({ credit, gymId, profileId }) {
    const wallet = await this.findOrCreate(profileId, gymId)

    await this.Wallet.updateOne(
      { _id: wallet._id },
      { $inc: { credit } }
    ).exec()
  }
}

module.exports = WalletController

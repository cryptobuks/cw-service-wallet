const { db, ctr, _, log } = require('@cowellness/cw-micro-service')()

/**
 * @class GiftcreditController
 * @classdesc Controller Giftcredit
 */
class GiftcreditController {
  constructor () {
    this.Wallet = db.data.model('Wallet')
  }

  /**
   * sendGiftCredit send gift Credit
   * @param {params} param0
   * @returns
   */
  async sendGiftCredit ({ profileId, gymId, creditAmount, expiryDate }) {
    const wallet = await ctr.wallet.findWallet({ gymId, profileId })
    log.info('Creating sift credit')
    await ctr.transaction.createGiftCreditTransaction({
      profileId,
      gymId,
      type: 'gift',
      amount: creditAmount,
      status: 'success',
      expiryDate
    })
    return wallet
  }

  /**
   * createGiftCreditEntry - add a new gift Credit Entry
   * @param {param} param
   */
  async createGiftCreditEntry ({ profileId, gymId, creditAmount, transactionId, expiryDate }) {
    const gift = await this.Wallet.update(
      { ownerId: gymId, profileId },
      {
        $push: {
          creditWithExpiration: {
            transactionId,
            credit: creditAmount,
            startCredit: creditAmount,
            expireAt: expiryDate
          }
        }
      }).exec()
    return gift
  }

  /**
   * expireGiftCredit
   * @param {Object} data
   */
  async expireGiftCredits () {
    const wallets = await this.Wallet.update(
      {},
      { $set: { 'creditWithExpiration.$[elem].status': 'expired' } },
      { arrayFilters: [{ 'elem.expireAt': { $lte: new Date() } }], multi: true }
    )

    return wallets
  }

  /**
   * Consume various gift wallet balance
   * @param {params} param0
   * @returns
   */
  async updateGiftWalletBalance ({ wallet, amount, gymId, profileId }) {
    const giftsWallets = wallet
    const activeGiftWallets = _.filter(giftsWallets, function (wallet) { return wallet.status === 'active' })
    const sortedGiftWallets = activeGiftWallets.sort((a, b) => a.expireAt - b.expireAt)
    let amountToBeDebited = amount
    for (let i = 0; i < sortedGiftWallets.length; i++) {
      const walletBalance = parseFloat(sortedGiftWallets[i].credit.toString())
      const amountLeft = amountToBeDebited - walletBalance
      if (amountLeft > 0) {
        amountToBeDebited = amountLeft
        await this.Wallet.update(
          { ownerId: gymId, profileId, 'creditWithExpiration._id': sortedGiftWallets[i]._id },
          {
            $inc: {
              'creditWithExpiration.$.credit': -walletBalance,
              'creditWithExpiration.$.consumed': walletBalance
            }
          }).exec()
      } else {
        await this.Wallet.update(
          { ownerId: gymId, profileId, 'creditWithExpiration._id': sortedGiftWallets[i]._id },
          {
            $inc: {
              'creditWithExpiration.$.credit': -amountToBeDebited,
              'creditWithExpiration.$.consumed': amountToBeDebited
            }
          }).exec()

        amountToBeDebited = 0
        break
      }
    }
    return amountToBeDebited
  }
}

module.exports = GiftcreditController

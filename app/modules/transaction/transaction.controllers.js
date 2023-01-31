const { db, ctr } = require('@cowellness/cw-micro-service')()

/**
 * @class TransactionController
 * @classdesc Controller Transaction
 */
class TransactionController {
  constructor () {
    this.Transaction = db.data.model('Transaction')
  }

  /**
   * getTransaction - Fetch user transaction on a particular wallet
   * @param {Integer} filter
   * @param {Integer} limit
   * @param {Integer} page
   * @returns
   */
  async getTransactions (filter, limit = 30, page = 1) {
    const transactions = await this.Transaction.find(filter)
      .skip((page - 1) * limit)
      .limit(limit, 10)
      .sort({ createdAt: -1 })
      .lean()

    return {
      transactions: transactions,
      _meta: {
        page,
        limit,
        count: transactions.length
      }
    }
  }

  /**
   * create a transaction entry
   * @param {Object} param
   *
   * @returns
   */
  async createTransaction ({ profileId, gymId, type, amount, status, gateway }) {
    const wallet = await ctr.wallet.findOrCreate(profileId, gymId)
    const transaction = await this.Transaction.create({
      walletId: wallet._id,
      profileId,
      ownerId: gymId,
      type,
      status,
      amount,
      gateway
    })

    const giftsWallet = wallet.creditWithExpiration
    if (amount < 0) {
      const amountDebitedFromGiftWallet = await ctr.giftCredit.updateGiftWalletBalance({ wallet: giftsWallet, amount: -(amount), gymId, profileId })
      if (amountDebitedFromGiftWallet) {
        await ctr.wallet.updateWalletBalance({ wallet: giftsWallet, credit: -amountDebitedFromGiftWallet, gymId, profileId })
      }
    } else {
      await ctr.wallet.updateWalletBalance({ credit: amount, gymId, profileId })
    }
    return transaction
  }

  /**
   * create a transaction entry
   * @param {Object} param
   *
   * @returns
   */
  async createGiftCreditTransaction ({ profileId, gymId, type, amount, status, expiryDate }) {
    const transaction = await this.Transaction.create({
      profileId,
      ownerId: gymId,
      type,
      status,
      amount
    })

    // update wallet balance
    await ctr.giftCredit.createGiftCreditEntry({ profileId, transactionId: transaction._id, gymId, creditAmount: amount, expiryDate })
    return transaction
  }
}

module.exports = TransactionController

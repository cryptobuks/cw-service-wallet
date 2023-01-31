const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
const { ctr, db } = cw

beforeAll(async () => {
  await cw.autoStart()
  await db.data.model('Transaction').deleteMany({})
})

describe('Transaction creation and fetching', () => {
  const profileId = '602a37043af0ba2dce439a3a'
  const gymId = '5fe4655ac123b10011000000'
  const filter = {
    profileId,
    gymId
  }
  it('should test transaction fetching', async () => {
    const data = await ctr.transaction.getTransactions(filter, 10, 1)
    expect(data._meta.count).toBe(0)
  })

  it('should test wallet fetching', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
    expect(wallet.credit).toBe(0)
  })

  it('should test credit transaction of +10.35', async () => {
    const transaction = await ctr.transaction.createTransaction({
      profileId,
      gymId,
      type: 'subscription',
      amount: 10.35,
      status: 'success',
      gateway: {
        type: 'viva',
        ref: 'random-string1',
        log: 'log of gateway'
      }
    })
    expect(transaction.profileId).toBe(profileId)
    expect(transaction.ownerId).toBe(gymId)
  })

  it('should test and add two gift credit to wallet', async () => {
    await ctr.giftCredit.sendGiftCredit({ profileId, gymId, creditAmount: 100, expiryDate: '2021-05-11' })
    await ctr.giftCredit.sendGiftCredit({ profileId, gymId, creditAmount: 200, expiryDate: '2021-04-11' })
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.creditWithExpiration.length).toBe(2)
    expect(parseFloat(wallet.creditWithExpiration[0].startCredit.toString())).toBe(100)
    expect(parseFloat(wallet.creditWithExpiration[0].credit.toString())).toBe(100)
    expect(parseFloat(wallet.creditWithExpiration[1].credit.toString())).toBe(200)
    expect(parseFloat(wallet.creditWithExpiration[1].startCredit.toString())).toBe(200)
  })

  it('should test and verify balance to be +10.35', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
    expect(wallet.credit).toBe(10.35)
  })

  it('should test debit transaction of -20.23', async () => {
    const transaction = await ctr.transaction.createTransaction({
      profileId,
      gymId,
      type: 'subscription',
      amount: -20.23,
      status: 'success',
      gateway: {
        type: 'viva',
        ref: 'random-string1',
        log: 'log of gateway'
      }
    })
    expect(transaction.profileId).toBe(profileId)
    expect(transaction.ownerId).toBe(gymId)
  })

  it('should test and verify balance to be  10.35 and gift to be 179.77 and 100', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
    expect(parseFloat(wallet.creditWithExpiration[0].credit.toString())).toBe(100)
    expect(parseFloat(wallet.creditWithExpiration[1].credit.toString())).toBe(179.77)
    expect(wallet.credit).toBe(10.35)
  })

  it('should test debit transaction of -180.77', async () => {
    const transaction = await ctr.transaction.createTransaction({
      profileId,
      gymId,
      type: 'subscription',
      amount: -180.77,
      status: 'success',
      gateway: {
        type: 'viva',
        ref: 'random-string1',
        log: 'log of gateway'
      }
    })
    expect(transaction.profileId).toBe(profileId)
    expect(transaction.ownerId).toBe(gymId)
  })

  it('should test and verify balance to be  10.35 and gift to be 0 and 99', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
    expect(parseFloat(wallet.creditWithExpiration[0].credit.toString())).toBe(99)
    expect(parseFloat(wallet.creditWithExpiration[1].credit.toString())).toBe(0)
    expect(wallet.credit).toBe(10.35)
  })

  it('should test debit transaction of 109', async () => {
    const transaction = await ctr.transaction.createTransaction({
      profileId,
      gymId,
      type: 'subscription',
      amount: -109,
      status: 'success',
      gateway: {
        type: 'viva',
        ref: 'random-string1',
        log: 'log of gateway'
      }
    })
    expect(transaction.profileId).toBe(profileId)
    expect(transaction.ownerId).toBe(gymId)
  })

  it('should test and verify balance to be  0.35 and gift to be 0 and 0', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
    expect(parseFloat(wallet.creditWithExpiration[0].credit.toString())).toBe(0)
    expect(parseFloat(wallet.creditWithExpiration[1].credit.toString())).toBe(0)
    expect(wallet.credit).toBe(0.35)
  })
})

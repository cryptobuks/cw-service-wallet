const config = require('config')
const cw = require('@cowellness/cw-micro-service')(config)
const { ctr, db } = cw

beforeAll(async () => {
  await cw.autoStart()
  await db.data.model('Wallet').deleteMany({})
})

describe('Test wallet creation and fetching', () => {
  const profileId = '602a37043af0ba2dce439a3a'
  const gymId = '5fe4655ac123b10011000000'
  it('should test wallet fetching', async () => {
    const wallet = await ctr.wallet.getWallet({ _user: { profileId }, profileId, gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
  })

  it('should test wallet creation', async () => {
    const wallet = await ctr.wallet.create({ profileId, ownerId: gymId })
    expect(wallet.profileId).toBe(profileId)
    expect(wallet.ownerId).toBe(gymId)
  })
})

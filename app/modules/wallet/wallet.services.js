const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()
const validationSchema = require('./wallet.schema')

rabbitmq.consume('/wallet/wallet/get', (msg) => {
  const { profileId, gymId } = msg.data

  const _user = {
    profileId
  }
  return ctr.wallet.getWallet({ _user, profileId, gymId })
}, { schema: validationSchema.getWallet.schema.body })

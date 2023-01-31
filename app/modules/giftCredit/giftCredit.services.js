const { sendGiftCredit } = require('./queueSchema/giftCredit')

const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()

rabbitmq.consume('/wallet/giftCredit/send', (msg) => {
  const filter = {
    profileId: msg.data.profileId,
    gymId: msg.data.gymId,
    creditAmount: msg.data.creditAmount,
    expiryDate: msg.data.expiryDate
  }
  return ctr.giftCredit.sendGiftCredit(filter)
}, { schema: sendGiftCredit })

rabbitmq.consume('/wallet/giftCredit/expire', ({ data }) => {
  return ctr.giftCredit.expireGiftCredits()
})

rabbitmq.send('/cron/append', {
  name: 'wallet:giftCredit:expire',
  type: 'cron',
  update: true,
  crontab: '0 0 * * *',
  commands: [{
    type: 'rabbitmq',
    queue: '/wallet/giftCredit/expire',
    msg: 'wallet'
  }]
})

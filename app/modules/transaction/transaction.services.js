const { ctr, rabbitmq } = require('@cowellness/cw-micro-service')()
const validationSchema = require('./queueSchema/transaction')

rabbitmq.consume('/wallet/transaction/get', (msg) => {
  const filter = msg.data
  return ctr.transaction.getTransactions({ profileId: filter._user.profileId, ownerId: filter.gymId })
}, { schema: validationSchema.getTransaction })

rabbitmq.consume('/wallet/transaction/add', (msg) => {
  const transaction = msg.data
  return ctr.transaction.createTransaction(transaction)
}, { schema: validationSchema.addTransaction })

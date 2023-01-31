const { transactionType, status, gateway } = require('./constants/transactions.constants')

const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.data.Schema

const newSchema = new Schema(
  {
    walletId: {
      type: String
    },
    ownerId: {
      type: String
    },
    profileId: {
      type: String
    },
    orderId: {
      type: String
    },
    product: {
      type: Object
    },
    ref: String,
    amount: {
      type: Schema.Types.Decimal128,
      default: '0.00'
    },
    type: {
      type: String,
      enum: transactionType
    },
    status: {
      type: String,
      enum: status
    },
    gateway: {
      type: {
        type: String,
        enum: gateway
      },
      ref: String,
      log: String
    },
    expireAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

newSchema.post('find', function (result) {
  result.map(doc => {
    if (doc.amount) {
      doc.amount = parseFloat(doc.amount.toString())
    }
  })
})

module.exports = db.data.model('Transaction', newSchema)

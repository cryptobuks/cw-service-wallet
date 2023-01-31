const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.data.Schema

const newSchema = new Schema(
  {
    transactionId: {
      type: Schema.ObjectId,
      ref: 'Transaction'
    },
    startCredit: {
      type: Schema.Types.Decimal128

    },
    consumed: {
      type: Schema.Types.Decimal128,
      default: '0.00'
    },
    credit: {
      type: Schema.Types.Decimal128,
      default: '0.00'
    },
    expireAt: {
      type: Date
    },
    status: {
      type: String,
      emun: ['active', 'expired'],
      default: 'active'
    }
  },
  { timestamps: true }
)

module.exports = newSchema

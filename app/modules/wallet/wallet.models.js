const giftCredit = require('./subschema/giftCredit.subschema')

const { db } = require('@cowellness/cw-micro-service')()

const Schema = db.data.Schema

const newSchema = new Schema(
  {
    ownerId: {
      type: String
    },
    profileId: {
      type: String
    },
    plafond: {
      type: Number,
      default: null
    },
    credit: {
      type: Schema.Types.Decimal128,
      default: '0.00'
    },
    creditWithExpiration: [
      giftCredit
    ]
  },
  { timestamps: true }
)
newSchema.post('findOne', function (doc) {
  if (doc) {
    doc.credit = parseFloat(doc.credit.toString())
  }
  return doc
})

module.exports = db.data.model('Wallet', newSchema)


module.exports = {
  sendGiftCredit: {
    schema: {
      tags: ['GiftCredit'],
      summary: 'Send Gift to user wallet',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['creditAmount', 'expiryDate'],
        properties: {
          creditAmount: {
            type: 'number',
            description: 'Amount of credit'
          },
          expiryDate: {
            type: 'string',
            description: 'Expiry date of credit',
            format: 'date'
          }
        }
      }
    }
  }
}

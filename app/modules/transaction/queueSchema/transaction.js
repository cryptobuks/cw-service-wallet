const { transactionType, gateway } = require('../constants/transactions.constants')

module.exports = {
  getTransactions: {
    schema: {
      tags: ['Transaction'],
      summary: 'Get a user wallet transactions on a gym',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['profileId', 'gymId'],
        properties: {
          profileId: {
            type: 'string',
            description: 'ProfileId of the user'
          },
          gymId: {
            type: 'string',
            description: 'Profile of gym'
          },
          limit: {
            type: 'number',
            description: 'Limit of the transaction'
          },
          page: {
            type: 'number',
            description: 'Page of the transaction'
          }
        }
      }
    }
  },

  addTransaction: {
    schema: {
      tags: ['Transaction'],
      summary: 'Get a user wallet transactions on a gym',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['profileId', 'gymId', 'amount', 'type', 'gateway'],
        properties: {
          profileId: {
            type: 'string',
            description: 'ProfileId of the user'
          },
          gymId: {
            type: 'string',
            description: 'Profile of gym'
          },
          amount: {
            type: 'number',
            description: 'Amount of transaction'
          },
          type: {
            type: 'string',
            enum: transactionType,
            description: 'Page of the transaction'
          },
          gateway: {
            type: 'object',
            nullable: true,
            required: ['type', 'ref', 'log'],
            properties: {
              type: {
                type: 'string',
                enum: gateway
              },
              ref: {
                type: 'string'
              },
              log: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }

}

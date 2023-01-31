
module.exports = {
  getTransactions: {
    schema: {
      tags: ['Transaction'],
      summary: 'Get a user wallet transaction on a gym',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['gymId'],
        properties: {
          gymId: {
            type: 'string',
            description: 'Profile of gym'
          },
          page: {
            type: 'number',
            description: 'page number'
          },
          limit: {
            type: 'number',
            description: 'limit number'
          }
        }
      }
    }
  }
}

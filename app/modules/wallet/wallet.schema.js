
module.exports = {
  getWallet: {
    schema: {
      tags: ['Wallet'],
      summary: 'Get a user wallet on a gym',
      security: [
        {
          authorization: []
        }
      ],
      body: {
        type: 'object',
        required: ['gymId', 'profileId'],
        properties: {
          gymId: {
            type: 'string',
            description: 'Profile of gym'
          },
          profileId: {
            type: 'string',
            description: 'Profile of the individual account'
          }

        }
      }
    }
  }

}

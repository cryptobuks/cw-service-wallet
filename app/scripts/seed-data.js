process.env.NODE_ENV = 'production'
const config = require('config')
const transactionsConstants = require('../modules/transaction/constants/transactions.constants')
config.fastify.port = 0
const cw = require('@cowellness/cw-micro-service')(config)
const _ = cw._
const transactionConstants = require('../modules/transaction/constants/transactions.constants')
cw.autoStart().then(async () => {
  try {
    addTransactions()
  } catch (error) {
    console.log(error)
  }
})
async function addTransactions () {
  const result = await cw.es.search({
    index: cw.envPrefix + 'profiles',
    body: {
      query: {
        bool: {
          must: [{
            match: {
              typeCode: ['IN', 'CH'].join(' OR ')
            }
          }]
        }
      }
    }
  })
  const profiles = _.get(result, 'hits.hits', [])
  const cwProfileId = _.first(profiles.filter(profile => profile._source.typeCode === 'CH').map(profile => profile._id))
  const profileIds = profiles.filter(profile => profile._source.typeCode === 'IN').map(profile => profile._id)
  const relationResult = await cw.es.search({
    index: cw.envPrefix + 'relations',
    body: {
      query: {
        bool: {
          must: [{
            match: {
              rightProfileId: profileIds.join(' OR ')
            }
          }, {
            match: {
              leftProfileId: cwProfileId
            }
          }]
        }
      }
    }
  })
  const relations = _.get(relationResult, 'hits.hits', [])
  const transactions = []
  relations.forEach(relation => {
    _.times(10, () => {
      transactions.push(cw.ctr.transaction.createTransaction({
        profileId: relation._source.rightProfileId,
        orderId: _.first(_.shuffle([null, 'testorder123'])),
        gymId: relation._source.leftProfileId,
        type: _.first(_.shuffle(transactionConstants.transactionType)),
        amount: _.round(_.random(1, 10, true), 2),
        status: _.first(_.shuffle(transactionsConstants.status)),
        gateway: {
          type: _.first(_.shuffle(transactionsConstants.gateway))
        }
      }))
    })
  })
  await Promise.all(transactions)
  console.log('done')
  process.exit()
}

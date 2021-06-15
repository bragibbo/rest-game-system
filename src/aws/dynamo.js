const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

const GAME_OBJECTS_TABLE = "GameObjects"

async function createTable(params) {
  try {
    const res = await dynamodb.createTable(params).promise()
    console.log(`${params.tableName} created`)
  } catch (e) {
    if (e.name === 'ResourceInUseException') {
      console.log(`${params.TableName} table already exists`)
    } else {
      console.error(e)
    }
  }
}

async function createGameObjectTable() {
  const gameObjectParams = {
    TableName : GAME_OBJECTS_TABLE,
    KeySchema: [       
        { AttributeName: "game_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "object_type", KeyType: "RANGE"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "game_id", AttributeType: "S" },
        { AttributeName: "object_type", AttributeType: "S"},
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5
  }
  };

  await createTable(gameObjectParams)
}

async function initialize() {
  await createGameObjectTable()
}

initialize()

module.exports.createItem = async (item) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    Item: item
  }

  const res = await docClient.put(params).promise()
  return res
}

module.exports.getItem = async (keys) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    Key: keys
  }

  const res = await docClient.get(params).promise()
  return res
}

module.exports.upsert = async (item) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    Item: item,
    ConditionExpression: 'attribute_not_exists(id)'
  };

  try {
    const res = await docClient.putItem(params).promise()
    return res
  } catch(e) {
    if (e instanceof docClient.ConditionalCheckFailedException) {
      return await this.getItem(item)
    }
    console.log(e)
    return null
  }
}

module.exports.updateTable = async (tableName, key, items) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    Key: key,
    UpdateExpression: '',
    ExpressionAttributeValues: {}
  }

  const res = await docClient.update(params).promise() 
  return res
}
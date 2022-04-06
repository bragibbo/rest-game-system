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

module.exports.getItem = async (rangeKey) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    KeyConditionExpression: "game_id = :gameId",
    ExpressionAttributeValues: {
      ":gameId": rangeKey,
    }
  };

  const result = await docClient.query(params).promise();
  return result.Items;
}

module.exports.getAllItems = async (sortKey) => {
  const params = {
    TableName: GAME_OBJECTS_TABLE,
    IndexName: 'object_type-index',
    KeyConditionExpression: "object_type = :objectType",
    ExpressionAttributeValues: {
      ":objectType": sortKey,
    }
  };

  const result = await docClient.query(params).promise();
  return result.Items;
}

IndexName: 'publisher_index',

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
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

async function createTable(params) {
  try {
    const res = await dynamodb.createTable(params).promise()
    console.log(res)

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
    TableName : "GameObjects",
    KeySchema: [       
        { AttributeName: "game_id", KeyType: "HASH"},  //Partition key
    ],
    AttributeDefinitions: [       
        { AttributeName: "game_id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5
  }
  };

  await createTable(gameObjectParams)
}

async function createGameUserTable() {
  const gameUsersParams = {
    TableName : "GameUsers",
    KeySchema: [       
        { AttributeName: "game_id", KeyType: "HASH"},  //Partition key
        { AttributeName: "user_name", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "game_id", AttributeType: "S" },
        { AttributeName: "user_name", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
      ReadCapacityUnits: 5, 
      WriteCapacityUnits: 5
  }
  };

  await createTable(gameUsersParams)
}

async function initialize() {
  await createGameObjectTable()
  await createGameUserTable()
}

initialize()

export async function createItem(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item
  }

  try {
    const res = await docClient.put(params).promise()
    return res

  } catch (e) {
    console.log(e)
    return null
  }

}

export async function getItem(tableName, keys) {
  const params = {
    TableName: tableName,
    Key: keys
  }

  try {
    const res = await docClient.get(params).promise()
    return res
  } catch(e) {
    console.log(e)
    return null
  }
}

export async function updateTable(tableName, key, params) {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: '',
    ExpressionAttributeValues: {}
  }

  try {
    const res = await docClient.update(params).promise() 
    return res

  } catch (e) {
    console.log(e)
    return null
  }
}
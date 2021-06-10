const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });

const dynamodb = new AWS.DynamoDB();

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

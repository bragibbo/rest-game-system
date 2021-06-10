const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-2" });

const dynamodb = new AWS.DynamoDB();

const gameObjectsParams = {
  TableName : "GameObjects",
  KeySchema: [       
      { AttributeName: "game_id", KeyType: "HASH"},  //Partition key
  ],
  AttributeDefinitions: [       
      { AttributeName: "game_id", AttributeType: "S" },
  ],
};

dynamodb.createTable(params, function(err, data) {
  if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});

const GamerUsersParams = {
  TableName : "GameUsers",
  KeySchema: [       
      { AttributeName: "game_id", KeyType: "HASH"},  //Partition key
      { AttributeName: "user_name", KeyType: "RANGE" }  //Sort key
  ],
  AttributeDefinitions: [       
      { AttributeName: "game_id", AttributeType: "S" },
      { AttributeName: "user_name", AttributeType: "S" }
  ],
};

dynamodb.createTable(params, function(err, data) {
  if (err) {
      console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam'; // 👈 Make sure this is imported

export class QuantumFortisInventoryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const inventory = new ddb.Table(this, 'KeyInventory', {
      partitionKey: { name: 'keyId', type: ddb.AttributeType.STRING },
    });

    // Define the Lambda function
    const listKeysFn = new lambda.Function(this, 'ListKeysFn', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/listKeys')),
      environment: {
        KEY_TABLE: inventory.tableName,
      },
    });

    // Grant write access to DynamoDB
    inventory.grantWriteData(listKeysFn);

    // ✅ Add permission to call kms:DescribeKey
    listKeysFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['kms:DescribeKey'],
        resources: ['*'], // Optionally scope this to specific ARNs
      })
    );
  }
}

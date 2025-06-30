import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export interface QuantumFortisInventoryStackProps extends cdk.StackProps {
  stage: string;
}

export class QuantumFortisInventoryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: QuantumFortisInventoryStackProps) {
    super(scope, id, props);

    const { stage } = props;

    // ✅ Key Inventory Table
    const inventory = new ddb.Table(this, `KeyInventory-${stage}`, {
      partitionKey: { name: 'keyId', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
    });

    // ✅ AuditLog Table
    const auditLog = new ddb.Table(this, `AuditLog-${stage}`, {
      partitionKey: { name: 'eventId', type: ddb.AttributeType.STRING },
      sortKey: { name: 'ts', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      stream: ddb.StreamViewType.NEW_IMAGE,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    // ✅ Lambda to list keys
    const listKeysFn = new lambda.Function(this, `ListKeysFn-${stage}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/listKeys')),
      environment: {
        KEY_TABLE: inventory.tableName,
      },
    });

    // ✅ Grant permissions to write to KeyInventory table
    inventory.grantWriteData(listKeysFn);

    // ✅ Allow DescribeKey for listKeysFn
    listKeysFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['kms:DescribeKey'],
        resources: ['*'],
      })
    );

    // ✅ RotateTest Lambda Function (KAN-50 ✅)
    const rotateTestFn = new lambda.Function(this, `RotateTestFn-${stage}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/rotateTest')),
      environment: {
        AUDIT_TABLE: auditLog.tableName, // ✅ Pass Audit table name
        TIMEOUT_MS: '3000',              // ✅ Swap delay in milliseconds
      },
      timeout: cdk.Duration.seconds(10),
      initialPolicy: [
        // ✅ CloudWatch Logs permissions
        new iam.PolicyStatement({
          actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
          resources: ['arn:aws:logs:*:*:*'],
        }),
        // ✅ DynamoDB write permissions for AuditLog table
        new iam.PolicyStatement({
          actions: ['dynamodb:PutItem'],
          resources: [auditLog.tableArn],
        }),
        // ✅ KMS permissions for key operations
        new iam.PolicyStatement({
          actions: ['kms:CreateKey'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'aws:RequestTag/QuantumFortis': 'Temp',
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['kms:UpdateAlias', 'kms:ScheduleKeyDeletion'],
          resources: ['*'],
        }),
      ],
    });

    // ✅ GetAudit Lambda Function to fetch Audit Logs
    const getAuditFn = new lambda.Function(this, `GetAuditFn-${stage}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/getAudit')),
      environment: {
        AUDIT_TABLE: auditLog.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });

    // ✅ Grant read permissions to GetAudit Lambda
    auditLog.grantReadData(getAuditFn);

    // ✅ API Gateway
    const api = new apigateway.RestApi(this, `QuantumFortisAPI-${stage}`, {
      restApiName: `QuantumFortisAPI-${stage}`,
      deployOptions: {
        stageName: stage,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['GET', 'POST', 'OPTIONS'],
      },
    });

    // ✅ /audit/verify route for audit logs
    const auditResource = api.root.addResource('audit');
    const verifyResource = auditResource.addResource('verify');
    verifyResource.addMethod('GET', new apigateway.LambdaIntegration(getAuditFn));

    // ✅ /keys route for listing keys
    const keysResource = api.root.addResource('keys');
    keysResource.addMethod('GET', new apigateway.LambdaIntegration(listKeysFn));

    // ✅ /rotate-test route for RotateTest Lambda (Optional but recommended)
    const rotateTestResource = api.root.addResource('rotate-test');
    rotateTestResource.addMethod('POST', new apigateway.LambdaIntegration(rotateTestFn));
  }
}

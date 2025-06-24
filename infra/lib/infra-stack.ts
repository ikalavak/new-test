import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';

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

    // ✅ Grant permissions to write to table
    inventory.grantWriteData(listKeysFn);

    // ✅ Allow DescribeKey
    listKeysFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['kms:DescribeKey'],
        resources: ['*'],
      })
    );

    // ✅ AuditLog Table for Milestone-3
    const auditLog = new ddb.Table(this, `AuditLog-${stage}`, {
      partitionKey: { name: 'eventId', type: ddb.AttributeType.STRING },
      sortKey: { name: 'ts', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      stream: ddb.StreamViewType.NEW_IMAGE,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    });

    // ✅ RotateTest Lambda Function
    const rotateTestFn = new lambda.Function(this, `RotateTestFn-${stage}`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/rotateTest')),
      environment: {
        AUDIT_TABLE: auditLog.tableName,
      },
      timeout: cdk.Duration.seconds(10),
      initialPolicy: [
        new iam.PolicyStatement({
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          resources: ['arn:aws:logs:*:*:*'],
        }),
        new iam.PolicyStatement({
          actions: ['dynamodb:PutItem'],
          resources: [auditLog.tableArn],
        }),
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
  }
}

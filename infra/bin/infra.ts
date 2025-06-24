#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { QuantumFortisInventoryStack } from '../lib/infra-stack';

const app = new cdk.App();

// 🟢 Production stack
new QuantumFortisInventoryStack(app, 'QuantumFortisInventoryStack', {
  stage: 'prod',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

// 🔵 Milestone-3 Dev stack
new QuantumFortisInventoryStack(app, 'QuantumFortisSwapDev', {
  stage: 'swap-dev',
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

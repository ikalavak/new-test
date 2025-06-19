#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { QuantumFortisInventoryStack } from '../lib/infra-stack';

const app = new cdk.App();
new QuantumFortisInventoryStack(app, 'QuantumFortisInventoryStack');

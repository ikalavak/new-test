import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const body = JSON.parse(event.body || '{}');

  console.log("🚀 Received RotateTest request:", body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "RotateTest successful",
      received: body,
    }),
  };
};

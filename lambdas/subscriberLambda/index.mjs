import {
  SNSClient,
  SubscribeCommand,
  UnsubscribeCommand
} from "@aws-sdk/client-sns";

const snsClient = new SNSClient({ region: "ap-south-1" });

export const handler = async (event) => {
  try {
    const path = event.rawPath || event.path; // HTTP API / REST API safe
    const body = JSON.parse(event.body || "{}");

    // ===================== SUBSCRIBE =====================
    if (path === "/subscribe") {
      const { emailAddress } = body;
      const topicArn = process.env.SNS_TOPIC_ARN;

      if (!topicArn || !emailAddress) {
        return response(400, {
          message: "Missing topicArn or emailAddress"
        });
      }

      const result = await snsClient.send(
        new SubscribeCommand({
          Protocol: "email",
          TopicArn: topicArn,
          Endpoint: emailAddress
        })
      );

      console.log("Subscribe response:", result);

      return response(200, {
        message: "Subscription successful. Check your email to confirm.",
        subscriptionArn: result.SubscriptionArn
      });
    }

    // ===================== UNSUBSCRIBE =====================
    if (path === "/unsubscribe") {
      const { subscriptionArn } = body;

      if (!subscriptionArn) {
        return response(400, {
          message: "Missing subscriptionArn"
        });
      }

      await snsClient.send(
        new UnsubscribeCommand({
          SubscriptionArn: subscriptionArn
        })
      );

      return response(200, {
        message: "Unsubscribed successfully"
      });
    }

    // ===================== NOT FOUND =====================
    return response(404, { message: "Route not found" });

  } catch (error) {
    console.error("Handler error:", error);
    return response(500, {
      message: "Request failed",
      error: error.message
    });
  }
};

// ---------- helper ----------
const response = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body)
});

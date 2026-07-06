import {
    SNSClient,
    PublishCommand
} from "@aws-sdk/client-sns";

export const handler = async (event) => {
    try {
        console.log("Received EventBridge event:", JSON.stringify(event, null, 2));

        const snsClient = new SNSClient({ region: "ap-south-1" });

        // EventBridge puts the custom payload inside the "detail" object
        const detail = event.detail;
        if (!detail) {
            throw new Error("No detail object found in event");
        }

        const clusterId = detail.cluster_id;
        const reason = detail.reason || "Volume Anomaly Detected";
        const logs = detail.sample_logs || [];

        // Format a beautiful, context-rich alert message
        let emailMessage = ` CRITICAL ALERT \n\n`;
        emailMessage += `Incident detected for Cluster ID: ${clusterId}\n`;
        emailMessage += `Reason: ${reason}\n\n`;
        emailMessage += `--- Recent Log Samples ---\n`;

        if (logs.length > 0) {
            logs.forEach((log, i) => {
                emailMessage += `${i + 1}. ${log}\n`;
            });
        } else {
            emailMessage += `No sample logs available.\n`;
        }

        emailMessage += `\nPlease check the SRE dashboard to triage this incident.`;

        // Grab the SNS Topic ARN from the environment variables we set in SAM template
        const topicArn = process.env.SNS_TOPIC_ARN;
        if (!topicArn) {
            throw new Error("SNS_TOPIC_ARN environment variable is missing");
        }

        // Publish to SNS!
        const result = await snsClient.send(
            new PublishCommand({
                TopicArn: topicArn,
                Subject: `[ACTION REQUIRED] Log Anomaly in Cluster ${clusterId}`,
                Message: emailMessage
            })
        );

        console.log("Publish response:", result);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Publish successful",
                messageId: result.MessageId
            })
        };

    }
    catch (error) {
        console.error("Handler error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Request failed",
                error: error.message
            })
        };
    }
};
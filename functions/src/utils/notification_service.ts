
// Imports the Google Cloud client library
import {PubSub } from "@google-cloud/pubsub"; //npm install --save @google-cloud/pubsub

import { info} from "firebase-functions/logger";
import { Message } from "../types/message";
// Creates a client; cache this for further use
const pubSubClient = new PubSub();

const MESSAGE_TOPIC=process.env.MESSAGE_TOPIC || 'NL-MESSAGE-TOPIC';
const MESSAGE_ORIGIN=process.env.MESSAGE_ORIGIN || 'NL-MESSAGE-MESSAGE_ORIGIN';

const publish=async(data:Message)=>{
    return await publishMessageWithCustomAttributes(MESSAGE_TOPIC, data);
}
const publishMessageWithCustomAttributes=async(topicNameOrId:string, data:Message)=> {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    const dataBuffer =data// Buffer.from(JSON.stringify(data));
  
    // Add two custom attributes, origin and username, to the message
    const customAttributes = {
      origin: MESSAGE_ORIGIN,
      username: 'gcp',
    };
  
    const messageId = await pubSubClient.topic(topicNameOrId)
                            .publishMessage({json: dataBuffer, attributes: customAttributes});

    info(`Message ${messageId} published.`);
    // const resp=new response();
    // resp.body=messageId;
    // resp.message=`Message ${messageId} published.`
    // return resp
}
export {publish}
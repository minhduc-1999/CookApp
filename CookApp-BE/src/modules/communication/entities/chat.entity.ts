import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractSchema } from "base/schemas/schema.base";
import { Type } from "class-transformer";
import { Document } from "mongoose";

@Schema()
export class ConversationModel extends AbstractSchema {
  @Prop()
  members: string[]

  @Prop()
  numOfMessages: number
}

export type ConversationDocument = ConversationModel & Document

export const ConversationSchema = SchemaFactory.createForClass(ConversationModel)

export const ConversationModelDefinition: ModelDefinition = {
  schema: ConversationSchema,
  name: ConversationModel.name,
  collection: "conversations"
}

@Schema()
class MessageModel extends AbstractSchema {
  @Prop()
  sender: string

  @Prop()
  to: string

  @Prop({ type: {}})
  content: {
    text: string,
    media: {
      link: string,
      type: "IMAGE" | "AUDIO" | "VIDEO"
    }[]
  }

  @Prop()
  externalLink: string
}

const MessageSchema = SchemaFactory.createForClass(MessageModel)


@Schema()
export class MessageBucketModel extends AbstractSchema {
  @Prop()
  seq: number

  @Prop({ type: [MessageSchema]})
  @Type(() => MessageModel)
  messages: MessageModel[]
}

export type MessageBucketDocument = MessageBucketModel & Document

export const MessageBucketSchema = SchemaFactory.createForClass(MessageBucketModel)

export const MessageBucketDefinition: ModelDefinition = {
  schema: MessageBucketSchema,
  name: MessageBucketModel.name,
  collection: "messages"
}

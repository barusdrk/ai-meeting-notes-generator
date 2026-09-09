import {Schema,model,InferSchemaType} from "mongoose";

const connectedAccountSchema=new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true,
  },
  organizationId:{
    type:Schema.Types.ObjectId,
    ref:"Organization",
    required:true,
    index:true,
  },
  provider:{
    type:String,
    enum:[
      "gmail",
      "outlook",
      "zoom",
      "google_meet",
      "teams",
    ],
    required:true,
  },
  email:{
    type:String,
    trim:true,
    lowercase:true,
  },
  accessToken:{
    type:String,
    required:true,
  },
  refreshToken:{
    type:String,
  },
  expiresAt:{
    type:Date,
  },
},{
  timestamps:true,
});

connectedAccountSchema.index(
  {
    organizationId:1,
    provider:1,
  },
  {
    unique:true,
  }
);

export type ConnectedAccountDocument=
  InferSchemaType<typeof connectedAccountSchema>;

export type ConnectedAccountProvider=
  |"gmail"
  |"outlook"
  |"zoom"
  |"google_meet"
  |"teams";

export default model(
  "ConnectedAccount",
  connectedAccountSchema
);

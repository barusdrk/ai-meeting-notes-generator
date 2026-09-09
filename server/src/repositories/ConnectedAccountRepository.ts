import {Types} from "mongoose";
import ConnectedAccount from "../models/ConnectedAccount.js";
import type {ConnectedAccountProvider} from "../models/ConnectedAccount.js";

type AccountData={
  userId:string;
  organizationId:string;
  provider:ConnectedAccountProvider;
  email?:string;
  accessToken:string;
  refreshToken?:string;
  expiresAt?:Date;
};

export async function findByOrganization(
  organizationId:string
){
  return ConnectedAccount.find({
    organizationId:new Types.ObjectId(
      organizationId
    ),
  }).sort({
    createdAt:-1,
  });
}

export async function findProvider(
  organizationId:string,
  provider:ConnectedAccountProvider
){
  return ConnectedAccount.findOne({
    organizationId:new Types.ObjectId(
      organizationId
    ),
    provider,
  });
}

export async function createAccount(
  data:AccountData
){
  return ConnectedAccount.create({
    ...data,
    userId:new Types.ObjectId(data.userId),
    organizationId:new Types.ObjectId(
      data.organizationId
    ),
  });
}

export async function upsertAccount(
  data:AccountData
){
  const update:{
    userId:Types.ObjectId;
    email?:string;
    accessToken:string;
    expiresAt?:Date;
    refreshToken?:string;
  }={
    userId:new Types.ObjectId(data.userId),
    email:data.email,
    accessToken:data.accessToken,
    expiresAt:data.expiresAt,
  };

  if(data.refreshToken!==undefined){
    update.refreshToken=data.refreshToken;
  }

  return ConnectedAccount.findOneAndUpdate(
    {
      organizationId:new Types.ObjectId(
        data.organizationId
      ),
      provider:data.provider,
    },
    {
      $set:update,
      $setOnInsert:{
        organizationId:new Types.ObjectId(
          data.organizationId
        ),
        provider:data.provider,
      },
    },
    {
      new:true,
      upsert:true,
      setDefaultsOnInsert:true,
    }
  );
}

export async function deleteAccount(
  organizationId:string,
  provider:ConnectedAccountProvider
){
  return ConnectedAccount.findOneAndDelete({
    organizationId:new Types.ObjectId(
      organizationId
    ),
    provider,
  });
}

import "dotenv/config";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Meeting from "../models/Meeting.js";

async function migrate(){
  const mongoUri=process.env.MONGODB_URI;

  if(!mongoUri){
    throw new Error(
      "MONGODB_URI is not configured."
    );
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected.");

  const tasks=await Task.find({
    $or:[
      {
        organizationId:{
          $exists:false,
        },
      },
      {
        organizationId:null,
      },
    ],
  }).select(
    "_id meetingId workspaceId userId organizationId"
  );

  console.log(
    `Found ${tasks.length} task(s) requiring migration.`
  );

  let migrated=0;
  let skipped=0;

  for(const task of tasks){
    if(!task.meetingId){
      console.warn(
        `Skipping task ${task._id}: no meetingId.`
      );
      skipped++;
      continue;
    }

    const meeting=await Meeting.findById(
      task.meetingId
    ).select(
      "_id organizationId"
    );

    if(!meeting){
      console.warn(
        `Skipping task ${task._id}: related meeting not found.`
      );
      skipped++;
      continue;
    }

    if(!meeting.organizationId){
      console.warn(
        `Skipping task ${task._id}: related meeting has no organizationId.`
      );
      skipped++;
      continue;
    }

    const result=await Task.updateOne(
      {
        _id:task._id,
        $or:[
          {
            organizationId:{
              $exists:false,
            },
          },
          {
            organizationId:null,
          },
        ],
      },
      {
        $set:{
          organizationId:meeting.organizationId,
        },
      }
    );

    if(result.modifiedCount===1){
      migrated++;

      console.log(
        `Migrated task ${task._id} -> organization ${meeting.organizationId}.`
      );
    }else{
      console.warn(
        `Task ${task._id} was not modified.`
      );
      skipped++;
    }
  }

  const remaining=await Task.countDocuments({
    $or:[
      {
        organizationId:{
          $exists:false,
        },
      },
      {
        organizationId:null,
      },
    ],
  });

  console.log(
    `Migration complete. Migrated: ${migrated}, skipped: ${skipped}, remaining: ${remaining}.`
  );

  if(remaining>0){
    console.warn(
      `${remaining} task(s) still have no organizationId and require manual review.`
    );
  }else{
    console.log(
      "All tasks have an organizationId."
    );
  }

  await mongoose.disconnect();
}

migrate().catch(async(error)=>{
  console.error(
    "Task organization migration failed:",
    error
  );

  await mongoose.disconnect();

  process.exit(1);
});

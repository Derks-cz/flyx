const { Schema, model, ObjectId } = require("mongoose")

const Message = Schema({
  chatId: { type: String, required: true },
  messages: [
    {
      id: {type:String},
      from: { type: ObjectId, ref: "Users" },
      body: { type: String,},
      createdAt: {
        time: {
          type: String,
          required:true
        },
        date: { type: String, required:true },
      },
    },
  ],
})

module.exports = model("Messages", Message)

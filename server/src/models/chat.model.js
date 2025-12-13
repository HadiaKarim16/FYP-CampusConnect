import mongoose, { mongo } from 'mongoose';

const chatSchema = new Schema({
  
  type: { 
    type: String, 
    enum: ['dm','society','studygroup'], 
    default: 'dm' 
},

  name: { 
    type: String, 
    required: true 
},
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: ['coordinator', 'member'], default: 'member' }
      }
    ],

    message:{
       messageSenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
       text: String,
       attachment: { fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }, name: String },
       deletedMessage: { type: Boolean, default: false },
       replyMessageTo: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage.message' }
    },


  lastMessageAt: Date,
}, { timestamps: true });

export const ChatMessage = mongoose.model('ChatMessage', chatSchema);
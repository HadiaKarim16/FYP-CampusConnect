import mongose from "mongoose";



const eventSchema = new Schema({ 
     
    title: { 
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title must be at most 100 characters long'],

    },
    
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Description must be at least 3 characters long'],
      maxlength: [400, 'Description must be at most 400 characters long'],
    },

    registeredStudents: [
        {
            type: mongose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    
    startAt: { type: Date, required: true },
    endAt:{ type: Date, required: true },

    societyId: { 
       tpye: Schema.Types.ObjectId,
       ref: 'Society' 
    },

    campusId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Campus'
    },

    location: {
        type: {
            type: String,
            enum: ['online','physical'], 
            default: 'physical',
            required: true,
        },
        tag:[
          {
          type: String,
          required: true,
          index: true
         }
        ],
        address: {
            type:String,
            required:true,

        },

        onlineUrl: String,   
    },

    category: {
        type: String,
        enum: ['Academic', 'Cultural', 'Sports', 'Social', 'Other'],
        default: 'Other',
    },

    

    capacity: {
         type: Number,
         default: 0 
        }, 

    requireApproval: { 
        type: Boolean, 
        default: false 
    },
    isCanceled: { 
        type: Boolean,
        default: false
     },
     
    registrationsCount: { type: Number, default: 0 },

    

},
 
{timestamps: true});

eventSchema.index({ campusId: 1, startAt: 1 });
eventSchema.index({ societyId: 1, startAt: 1 });
eventSchema.index({ _id: 1, startAt: 1 });
eventSchema.index({ _id: 1, registeredStudents: 1 });
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ isCanceled: 1 }, { partialFilterExpression: { isCanceled: { $eq: false } } });

export const Event = mongose.model("Event", eventSchema);
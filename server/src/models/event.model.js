import mongose from "mongoose";



const EventSchema = new mongose.Schema({ 
     
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

    startAt: { type: Date, required: true },

    societyId: { 
       tpye: Schema.Types.ObjectId,
       ref: 'Society' 
    },

    campusId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Campus'
    },

    category: {
        type: String,
        enum: ['Academic', 'Cultural', 'Sports', 'Social', 'Other'],
        default: 'Other',
    },

    endAt: Date,

    capacity: {
         type: Number,
         default: 0 
        }, 

    isCanceled: { 
        type: Boolean,
        default: false
     },
    
    tagsCount: { type: Number, default: 0 }, 
    registrationsCount: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 }, 




},
 
{timestamps: true});


export const Event = mongose.model("Event", EventSchema);
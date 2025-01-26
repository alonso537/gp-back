import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        unique: true
    },
    desc: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Beign',
        enum: ['Beign', 'In Progress', 'Completed', 'Archived', 'Cancelled']
    },
    limitDate: {
        type: Date,
        required: [true, 'Limit date is required']
    },
    
}, {
    timestamps: true
})

projectSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret, options) {
        delete ret._id;
    }
})

export const ProjectModel = mongoose.model('Project', projectSchema);
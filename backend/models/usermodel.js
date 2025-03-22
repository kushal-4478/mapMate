import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";




// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxLength:[30,"not more than 30 char"],
        minlength:[4,">=4 char in name"],
        
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8,"password shoud be >=8"],
        select: false   //jab include karo +password karo
    },
    confirmPassword: {
        type: String,
        required: [false, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        },
        select: false     //jab include karo +password karo..
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    interests: {
        type: [String],
        default: [],
    },
    profilePicture: {
        type: String,
        default: '',
    },
    avatar: {
        public_id:{
            type: String ,
            required: true,
        },
        url :{
            type:String,
            required:true,
        }
       
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

export default User;
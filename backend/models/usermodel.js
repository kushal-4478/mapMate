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
            required: false,
        },
        url :{
            type:String,
            required:false,
        }
       
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    personalDetails: {
        occupation: {
            type: String,
            trim: true,
            default: ''
        },
        education: {
            type: String,
            trim: true,
            default: ''
        },
        age: {
            type: Number,
            min: [18, 'Age must be at least 18'],
            max: [100, 'Age must be less than 100']
        },
        bio: {
            type: String,
            trim: true,
            maxLength: [500, 'Bio cannot be more than 500 characters'],
            default: ''
        },
        languages: [{
            type: String,
            trim: true
        }]
    },
    location: {
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        },
        coordinates: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number]
        }
    },
    preferences: {
        ageRange: {
            min: {
                type: Number,
                min: 18,
                default: 18
            },
            max: {
                type: Number,
                max: 100,
                default: 50
            }
        },
        distance: {
            type: Number,
            default: 50 // in kilometers
        },
        interestedIn: {
            type: String,
            enum: ['Men', 'Women', 'Both'],
            required: true
        }
    },
    socialLinks: {
        instagram: String,
        facebook: String,
        twitter: String,
        linkedin: String
    },
    verificationStatus: {
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        isPhoneVerified: {
            type: Boolean,
            default: false
        },
        isProfileComplete: {
            type: Boolean,
            default: false
        }
    }
});

// Add index for geospatial queries
userSchema.index({ "location.coordinates": "2dsphere" });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
    //console.log("Entered Password:", enteredPassword); // Debugging log
    //console.log("Hashed Password:", this.password); // Debugging log
  
    if (!enteredPassword || !this.password) {
      throw new Error("Password and hash are required");
    }
  
    return await bcrypt.compare(enteredPassword, this.password);
};
// Create the user model
const User = mongoose.model('User', userSchema);

export default User;
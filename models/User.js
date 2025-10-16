const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // Firebase UID
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Basic user info
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    // User permissions
    permissions: {
      // Dashboard access
      canAccessDashboard: {
        type: Boolean,
        default: false,
      },

      // Contact management
      canViewContacts: {
        type: Boolean,
        default: false,
      },
      canEditContacts: {
        type: Boolean,
        default: false,
      },
      canDeleteContacts: {
        type: Boolean,
        default: false,
      },

      // Join requests management
      canViewJoinRequests: {
        type: Boolean,
        default: false,
      },
      canEditJoinRequests: {
        type: Boolean,
        default: false,
      },
      canDeleteJoinRequests: {
        type: Boolean,
        default: false,
      },

      // Admin management
      canManageAdmins: {
        type: Boolean,
        default: false,
      },

      // Settings
      canManageSettings: {
        type: Boolean,
        default: false,
      },

      // Reports
      canViewReports: {
        type: Boolean,
        default: false,
      },
      canExportData: {
        type: Boolean,
        default: false,
      },
    },

    // User role
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },

    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Last login
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ firebaseUid: 1 });
UserSchema.index({ role: 1 });

// Method to get user permissions
UserSchema.methods.getPermissions = function () {
  return this.permissions;
};

// Method to check if user has specific permission
UserSchema.methods.hasPermission = function (permission) {
  return this.permissions[permission] === true;
};

// Static method to find user by Firebase UID
UserSchema.statics.findByFirebaseUid = function (firebaseUid) {
  return this.findOne({ firebaseUid });
};

// Static method to create or update user from Firebase
UserSchema.statics.createOrUpdateFromFirebase = async function (
  firebaseUid,
  userData
) {
  const user = await this.findOneAndUpdate(
    { firebaseUid },
    {
      ...userData,
      lastLogin: new Date(),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return user;
};

module.exports = mongoose.model("User", UserSchema);



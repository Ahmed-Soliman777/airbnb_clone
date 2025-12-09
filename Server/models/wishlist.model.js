// const mongoose = require("mongoose");

// const wishListSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     listing: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Listing",
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // compound unique index to prevent duplicates
// wishListSchema.index({ user: 1, listing: 1 }, { unique: true });

// // optional: index on user for faster queries (covered by compound index already)
// wishListSchema.index({ user: 1 });

// module.exports =
//   mongoose.models.WishList || mongoose.model("WishList", wishListSchema);

////////////////////////
const mongoose = require("mongoose");

// Schema للقائمة (Collection) - كل قائمة تخص يوزر واحد وفيها مجموعة listings
const wishlistCollectionSchema = new mongoose.Schema(
  {
    // اليوزر اللي عامل القائمة
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ربط بجدول User
      required: true,
    },

    // اسم القائمة (مثلاً: "Summer Trips")
    name: {
      type: String,
      required: true,
      trim: true, // يمسح المسافات من الأول والآخر
      maxlength: 50, // أقصى طول 50 حرف
    },

    // مصفوفة من IDs الـ listings اللي في القائمة
    listings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing", // ربط بجدول Listing
      },
    ],
  },
  {
    timestamps: true, // يضيف createdAt و updatedAt تلقائياً
  }
);

// Index عشان اليوزر ميقدرش يعمل قائمتين بنفس الاسم
// مثلاً: مينفعش يعمل "Beach Houses" مرتين
wishlistCollectionSchema.index({ user: 1, name: 1 }, { unique: true });

// تصدير الـ Model
module.exports =
  mongoose.models.WishlistCollection ||
  mongoose.model("WishlistCollection", wishlistCollectionSchema);

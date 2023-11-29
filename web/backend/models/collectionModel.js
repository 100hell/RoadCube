import mongoose from "mongoose";

const collectionSchema = mongoose.Schema(
  {
    store_domain: {
      type: String,
      required: true,
    },
    collection_id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    roadcube_id: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Collections = mongoose.model("Collection", collectionSchema);

export default Collections;

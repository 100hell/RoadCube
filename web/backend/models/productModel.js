import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    store_domain: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    variants: [
      {
        variant_id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        roadcube_id: {
          type: String,
          default: "",
        },
        variant_deleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    synced: {
      type: Boolean,
      default: false,
    },
    product_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("Product", productSchema);

export default Products;

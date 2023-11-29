import mongoose from "mongoose";

const storeModel = mongoose.Schema(
  {
    store_domain: {
      type: String,
      required: true,
    },
    app_id: {
      type: String,
      required: true,
    },
    roadcube_store_id: {
      type: String,
      default: "",
    },
    roadcube_token: {
      type: String,
      default: "",
    },
    products_flag: {
      type: Boolean,
      default: false,
    },
    customers_flag: {
      type: Boolean,
      default: false,
    },
    transaction_amount: {
      type: Boolean,
      default: true,
    },
    transaction_products: {
      type: Boolean,
      default: false,
    },
    order_create_points: {
      type: Boolean,
      default: true,
    },
    order_paid_points: {
      type: Boolean,
      default: false,
    },
    order_fulfilled_points: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Stores = mongoose.model("Store", storeModel);

export default Stores;

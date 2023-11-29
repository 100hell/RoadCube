import mongoose from "mongoose";

const customerModel = mongoose.Schema(
  {
    store_domain: {
      type: String,
      required: true,
    },
    customer_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      default: "",
    },
    roadcube_id: {
      type: String,
      default: "",
    },
    roadcube_mobile_id: {
      type: String,
      default: "",
    },
    coupons_claims: [
      {
        price_rule_id: { type: String, default: "" },
        coupon_id_roadcube: { type: String, default: "" },
        code: { type: String, default: "" },
      },
    ],
    synced: {
      type: Boolean,
      default: false,
    },
    customer_deleted: {
      type: Boolean,
      default: false,
    },
    customer_latest_order_details: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Customers = mongoose.model("Customer", customerModel);

export default Customers;

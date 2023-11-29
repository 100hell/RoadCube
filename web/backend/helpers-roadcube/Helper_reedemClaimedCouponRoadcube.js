import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";

const Helper_reedemClaimedCouponRoadcube = async ({
  token,
  storeID,
  coupon_id,
}) => {
  try {
    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/redeems`;

    let inputs = {
      voucher: coupon_id,
      store_id: storeID,
    };

    let headers = {
      "Content-Type": "application/json",
      "X-Api-Token": token,
      Accept: "application/json",
    };

    const { data } = await axios.post(host, inputs, { headers });
    // console.log(data);
    return data;
  } catch (error) {
    // console.log(error.response?.data || error);
    return {
      error: `Claimed ${coupon_id} - ${
        error?.response?.data?.message ||
        error.message ||
        "not found on roadcube"
      }`,
    };
  }
};

export default Helper_reedemClaimedCouponRoadcube;

import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";

const Helper_getProductCategoryRoadcube = async ({ store_id, token, page }) => {
  try {
    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/stores/${store_id}/product-categories?page=${page || 1}`;

    let headers = {
      "Content-Type": "application/json",
      "X-Api-Token": token,
      Accept: "application/json",
    };

    const { data } = await axios.get(host, { headers });

    return data;
  } catch (error) {
    // console.log(error?.response?.data || error);
    return {
      error:
        error?.response?.data?.message ||
        error.message ||
        "Collections not found on roadcube",
    };
  }
};

export default Helper_getProductCategoryRoadcube;

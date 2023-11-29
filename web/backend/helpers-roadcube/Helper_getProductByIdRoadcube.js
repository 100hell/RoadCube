import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";

const Helper_getProductByIdRoadcube = async ({
  product_id,
  store_id,
  token,
}) => {
  try {
    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/stores/${store_id}/products?product_id=${product_id}&page=1`;
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
      error: `${product.title} - ${
        error?.response?.data?.message ||
        error.message ||
        "Product not created on roadcube"
      }`,
    };
  }
};

export default Helper_getProductByIdRoadcube;

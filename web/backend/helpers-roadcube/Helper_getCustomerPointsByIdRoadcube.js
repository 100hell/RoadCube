import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";

const Helper_getCustomerPointsByIdRoadcube = async ({
  customer_email,
  token,
}) => {
  try {
    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/users/points`;

    let inputs = {
      user: customer_email,
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
      error: `Customer ${customer_email} - ${
        error?.response?.data?.message ||
        error.message ||
        "not found on roadcube"
      }`,
    };
  }
};

export default Helper_getCustomerPointsByIdRoadcube;

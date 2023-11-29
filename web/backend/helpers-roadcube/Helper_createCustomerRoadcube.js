import dotenv from "dotenv";
dotenv.config({});

import axios from "axios";
import Customers from "../models/customerModel.js";
import Helper_getCustomerByIdRoadcube from "./Helper_getCustomerByIdRoadcube.js";

const Helper_createCustomerRoadcube = async ({
  customer,
  token,
  shop_domain,
}) => {
  try {
    // find Customer in database
    const _customer_db = await Customers.findOne({
      $and: [
        {
          store_domain: shop_domain,
        },
        {
          email: customer.email,
        },
      ],
    });

    // find user using user roadcube id
    const roadcube_user = await Helper_getCustomerByIdRoadcube({
      customer_email: _customer_db?.email || customer.email,
      token,
    });

    if (roadcube_user.data && _customer_db) {
      await Customers.updateOne(
        { _id: _customer_db._id },
        {
          customer_id: customer.admin_graphql_api_id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          roadcube_mobile_id: roadcube_user.data.mobile,
          synced: true,
        }
      );

      return {
        data: roadcube_user.data,
      };
    } else if (roadcube_user.data && !_customer_db) {
      await Customers.create({
        store_domain: shop_domain,
        customer_id: customer.admin_graphql_api_id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        roadcube_mobile_id: roadcube_user.data.mobile,
        synced: true,
      });

      return {
        data: roadcube_user.data,
      };
    }

    let host = `${
      process.env.ROADCUBE_HOST || "https://api.roadcube.io/v1/p"
    }/users/registration/email`;

    let inputs = {
      email: customer?.email,
      gender: customer?.gender || "male",
      password: customer?.password || "Sapients@Dev",
      password_confirmation: customer?.password || "Sapients@Dev",
      marketing: customer?.accepts_marketing ? true : false,
      birthday: customer?.birthday || "1970-01-01",
    };

    let headers = {
      "Content-Type": "application/json",
      "X-Api-Token": token,
      Accept: "application/json",
    };

    const { data } = await axios.post(host, inputs, { headers });

    if (_customer_db) {
      await Customers.updateOne(
        { _id: _customer_db._id },
        {
          customer_id: customer.admin_graphql_api_id,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          roadcube_id: data.data.user.user_registration_identifier,
          roadcube_mobile_id: data.data.user.mobile,
          synced: true,
        }
      );
    } else {
      await Customers.create({
        store_domain: shop_domain,
        customer_id: customer.admin_graphql_api_id,
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        roadcube_id: data.data.user.user_registration_identifier,
        roadcube_mobile_id: data.data.user.mobile,
        synced: true,
      });
    }

    return data;
  } catch (error) {
    // console.log(error.response?.data || error);
    return {
      error: `${customer.email} - ${
        error?.response?.data?.message ||
        error.message ||
        "Cutomer not created on roadcube"
      }`,
    };
  }
};

export default Helper_createCustomerRoadcube;

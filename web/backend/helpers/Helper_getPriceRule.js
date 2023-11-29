import shopify from "../../shopify.js";

const Helper_getPriceRule = async ({ session, since_id }) => {
  try {
    const existing_price_rules = await shopify.api.rest.PriceRule.all({
      session,
      since_id: since_id || 0,
    });

    return { price_rules: existing_price_rules.data };
  } catch (error) {
    return {
      error: error.message || "Price rules not found",
    };
  }
};

export default Helper_getPriceRule;

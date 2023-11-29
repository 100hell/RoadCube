// @ts-check
import dotenv from "dotenv";
dotenv.config({});

import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

import cors from "cors";

import connectDB from "./backend/configs/db.js";

import { errorHandler, notFound } from "./backend/middlewares/errorHandlers.js";
import Middleware_saveStoreAppID from "./backend/middlewares/Middleware_saveStoreAppID.js";
import Middleware_getTokenAndStoreID from "./backend/middlewares/Middleware_getTokenAndStoreID.js";
// app
import _getProductsSyncCount from "./backend/controllers/app/_getProductsSyncCount.js";
import _getCustomersSyncCount from "./backend/controllers/app/_getCustomersSyncCount.js";
import _syncCustomers from "./backend/controllers/app/_syncCustomers.js";
import _syncProducts from "./backend/controllers/app/_syncProducts.js";
import _getStoreDetails from "./backend/controllers/app/_getStoreDetails.js";
import _updateStoreDetails from "./backend/controllers/app/_updateStoreDetails.js";
// store front
import __getCustomerPoints from "./backend/controllers/store-front/__getCustomerPoints.js";
import __getProductVariantPoints from "./backend/controllers/store-front/__getProductVariantPoints.js";
import __getAvailableCoupons from "./backend/controllers/store-front/__getAvailableCoupons.js";
import __claimCoupon from "./backend/controllers/store-front/__claimCoupon.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Connect MongoDB
connectDB();

app.use(cors());

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  Middleware_saveStoreAppID, // save store id and domain and app id
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js
app
  .route("/api/store-front/coupons")
  .all(Middleware_getTokenAndStoreID)
  .get(__getAvailableCoupons)
  .post(__claimCoupon);

app
  .route("/api/store-front/get-product-points")
  .all(Middleware_getTokenAndStoreID)
  .get(__getProductVariantPoints);

app
  .route("/api/store-front/get-customer-points")
  .all(Middleware_getTokenAndStoreID)
  .get(__getCustomerPoints);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.route("/api/store-details").get(_getStoreDetails).post(_updateStoreDetails);

app
  .route("/api/products-sync")
  .all(Middleware_getTokenAndStoreID)
  .get(_getProductsSyncCount)
  .post(_syncProducts);

app
  .route("/api/customers-sync")
  .all(Middleware_getTokenAndStoreID)
  .get(_getCustomersSyncCount)
  .post(_syncCustomers);

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

// // Used middlewares for error handling
// app.use(notFound);
// app.use(errorHandler);

app.listen(PORT);

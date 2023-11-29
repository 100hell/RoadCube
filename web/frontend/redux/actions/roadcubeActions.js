import {
  _GET_SETTINGS_DETAILS,
  _GET_SETTINGS_DETAILS_LOADING,
  _UPDATE_SETTINGS_DETAILS,
  _UPDATE_SETTINGS_DETAILS_LOADING,
  // Get Products and Customers Count
  _GET_PRODUCTS_SYNC_COUNT_LOADING,
  _SET_PRODUCTS_SYNC_COUNT,
  _GET_UPDATES_SYNC_COUNT_LOADING,
  _SET_UPDATES_SYNC_COUNT,
  // Synced Products and Customers
  _SYNC_PRODUCTS_LOADING,
  _SYNC_CUSTOMERS_LOADING,
  _DASHBOARD_PAGE_BANNER,
  _SETTINGS_PAGE_BANNER,
} from "../reducers/roadcubeSlice";

export const _dispatch_GET_SETTINGS_DETAILS =
  ({ fetchFn, navigateFn }) =>
  async (dispatch) => {
    try {
      dispatch(_GET_SETTINGS_DETAILS_LOADING(true));

      const data = await fetchFn("/api/store-details");
      const dataJSON = await data.json();

      if (dataJSON.error) {
        throw new Error(dataJSON.error);
      }

      dispatch(_GET_SETTINGS_DETAILS(dataJSON));
      dispatch(_GET_SETTINGS_DETAILS_LOADING(false));
    } catch (error) {
      dispatch(_GET_SETTINGS_DETAILS_LOADING(false));
    }
  };

export const _dispatch_UPDATE_SETTINGS_DETAILS =
  ({ fetchFn, inputs }) =>
  async (dispatch) => {
    try {
      if (!inputs) {
        throw new Error("Invalid operation performed");
      }

      dispatch(
        _UPDATE_SETTINGS_DETAILS_LOADING({
          key: inputs?.loadingKey,
          loading: true,
        })
      );

      const data = await fetchFn("/api/store-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const dataJSON = await data.json();

      if (dataJSON.error) {
        throw new Error(dataJSON.error);
      }

      let keys = Object.keys(inputs || {});
      for (var i = 0; i < keys.length; i++) {
        let value = dataJSON[keys[i]];

        if (value !== undefined) {
          dispatch(
            _UPDATE_SETTINGS_DETAILS({
              key: keys[i],
              value,
            })
          );
        }
      }

      dispatch(
        _SETTINGS_PAGE_BANNER({
          message: dataJSON.message || "Updated.",
          status: "success",
        })
      );

      dispatch(
        _UPDATE_SETTINGS_DETAILS_LOADING({
          key: inputs?.loadingKey,
          loading: false,
        })
      );

      if (inputs.type === "token-and-store-update") {
        dispatch(
          _dispatch_GET_SYNC_PRODUCTS_COUNT({
            fetchFn,
          })
        );

        dispatch(
          _dispatch_GET_SYNC_CUSTOMERS_COUNT({
            fetchFn,
          })
        );
      }
    } catch (error) {
      dispatch(
        _UPDATE_SETTINGS_DETAILS_LOADING({
          key: inputs?.loadingKey,
          loading: false,
        })
      );

      dispatch(
        _SETTINGS_PAGE_BANNER({
          message: error.message || "Somethings wrong. Try again",
          status: "critical",
        })
      );
    }
  };

export const _dispatch_GET_SYNC_PRODUCTS_COUNT =
  ({ fetchFn }) =>
  async (dispatch) => {
    try {
      dispatch(_GET_PRODUCTS_SYNC_COUNT_LOADING(true));

      const data = await fetchFn("/api/products-sync");
      const { error, total, remaining, unsyncProducts } = await data.json();

      if (error) {
        throw new Error(error);
      }

      dispatch(_GET_PRODUCTS_SYNC_COUNT_LOADING(false));
      dispatch(
        _SET_PRODUCTS_SYNC_COUNT({
          total: total || 0,
          remaining: remaining || 0,
          unsyncProducts: unsyncProducts || [],
        })
      );
    } catch (error) {
      dispatch(_GET_PRODUCTS_SYNC_COUNT_LOADING(false));
      dispatch(
        _DASHBOARD_PAGE_BANNER({
          status: "critical",
          title: error.message || "Products not found for sync",
        })
      );
    }
  };

export const _dispatch_SYNC_PRODUCTS =
  ({ fetchFn, inputs }) =>
  async (dispatch) => {
    try {
      dispatch(_SYNC_PRODUCTS_LOADING(true));

      const data = await fetchFn("/api/products-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });
      const { error, message, errors } = await data.json();

      if (error) {
        throw new Error(error);
      }

      dispatch(_SYNC_PRODUCTS_LOADING(false));
      dispatch(
        _DASHBOARD_PAGE_BANNER({
          status: errors ? "critical" : "success",
          title:
            message || (errors ? "Products not synced" : "Products synced"),
          errors,
        })
      );

      // Get Products Count Again
      dispatch(
        _dispatch_GET_SYNC_PRODUCTS_COUNT({
          fetchFn: fetchFn,
        })
      );
    } catch (error) {
      dispatch(_SYNC_PRODUCTS_LOADING(false));
      dispatch(
        _DASHBOARD_PAGE_BANNER({
          status: "critical",
          title: error.message || "Products not synced",
        })
      );
    }
  };

export const _dispatch_GET_SYNC_CUSTOMERS_COUNT =
  ({ fetchFn }) =>
  async (dispatch) => {
    try {
      dispatch(_GET_UPDATES_SYNC_COUNT_LOADING(true));

      const data = await fetchFn("/api/customers-sync");
      const { error, total, remaining, unsyncCustomers } = await data.json();

      if (error) {
        throw new Error(error);
      }

      dispatch(_GET_UPDATES_SYNC_COUNT_LOADING(false));
      dispatch(
        _SET_UPDATES_SYNC_COUNT({
          total: total || 0,
          remaining: remaining || 0,
          unsyncCustomers: unsyncCustomers || [],
        })
      );
    } catch (error) {
      dispatch(_GET_UPDATES_SYNC_COUNT_LOADING(false));
    }
  };

export const _dispatch_SYNC_CUSTOMERS =
  ({ fetchFn, inputs }) =>
  async (dispatch) => {
    try {
      dispatch(_SYNC_CUSTOMERS_LOADING(true));

      const data = await fetchFn("/api/customers-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const { error, message, errors } = await data.json();

      if (error) {
        throw new Error(error);
      }

      dispatch(_SYNC_CUSTOMERS_LOADING(false));
      dispatch(
        _DASHBOARD_PAGE_BANNER({
          status: errors ? "critical" : "success",
          title:
            message || (errors ? "Customers not synced" : "Customers synced"),
          errors,
        })
      );

      // Get Customers Count Again
      dispatch(
        _dispatch_GET_SYNC_CUSTOMERS_COUNT({
          fetchFn: fetchFn,
        })
      );
    } catch (error) {
      dispatch(_SYNC_CUSTOMERS_LOADING(false));
      dispatch(
        _DASHBOARD_PAGE_BANNER({
          status: "critical",
          title: error.message || "Customers not synced",
        })
      );
    }
  };

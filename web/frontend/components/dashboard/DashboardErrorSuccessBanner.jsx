import { Banner } from "@shopify/polaris";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _DASHBOARD_PAGE_BANNER } from "../../redux/reducers/roadcubeSlice";

const DashboardErrorSuccessBanner = () => {
  const dispatch = useDispatch();

  const { dashboardPageBannerSuccessErrorMessage } = useSelector(
    (states) => states.roadcube
  );

  useEffect(() => {
    if (dashboardPageBannerSuccessErrorMessage) {
      setTimeout(() => {
        dispatch(_DASHBOARD_PAGE_BANNER(null));
      }, [5000]);
    }
  }, [dashboardPageBannerSuccessErrorMessage]);

  return (
    <Banner
      title={dashboardPageBannerSuccessErrorMessage?.title}
      status={dashboardPageBannerSuccessErrorMessage?.status}
      onDismiss={() => {
        dispatch(_DASHBOARD_PAGE_BANNER(null));
      }}
    >
      {dashboardPageBannerSuccessErrorMessage?.errors
        ?.filter((x, index) => index < 5)
        .map((x, index) => (
          <p key={index}>{x}</p>
        ))}
    </Banner>
  );
};

export default DashboardErrorSuccessBanner;

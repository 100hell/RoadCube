import { Banner } from "@shopify/polaris";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { _SETTINGS_PAGE_BANNER } from "../../redux/reducers/roadcubeSlice";

const SettingsErrorSuccessBanner = () => {
  const dispatch = useDispatch();

  const { settingPageBannerSuccessErrorMessage } = useSelector(
    (states) => states.roadcube
  );

  useEffect(() => {
    if (settingPageBannerSuccessErrorMessage) {
      setTimeout(() => {
        dispatch(_SETTINGS_PAGE_BANNER(null));
      }, [3000]);
    }
  }, [settingPageBannerSuccessErrorMessage]);

  return (
    <Banner
      title={settingPageBannerSuccessErrorMessage?.message}
      status={settingPageBannerSuccessErrorMessage?.status}
    />
  );
};

export default SettingsErrorSuccessBanner;

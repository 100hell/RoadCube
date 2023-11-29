import { Button, LegacyCard, LegacyStack } from "@shopify/polaris";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { _dispatch_UPDATE_SETTINGS_DETAILS } from "../../redux/actions/roadcubeActions";

const CustomersShowHide = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();

  const { settingsData, settingsDataLoading, updateSettingsDataLoading } =
    useSelector((states) => states.roadcube);

  return (
    <LegacyCard title={t("settings.customersFlagCard.title")} sectioned>
      <LegacyStack vertical>
        <p>{t("settings.customersFlagCard.subheading")}</p>
        <LegacyStack distribution="trailing">
          <Button
            primary={settingsData?.customers_flag ? false : true}
            destructive={settingsData?.customers_flag ? true : false}
            loading={updateSettingsDataLoading?.update_customers_flag_loading}
            disabled={settingsDataLoading}
            onClick={() => {
              dispatch(
                _dispatch_UPDATE_SETTINGS_DETAILS({
                  fetchFn: fetch,
                  inputs: {
                    loadingKey: "update_customers_flag_loading",
                    customers_flag: settingsData?.customers_flag ? false : true,
                  },
                })
              );
            }}
          >
            {settingsData?.customers_flag
              ? t("settings.customersFlagCard.hideBtnTitle")
              : t("settings.customersFlagCard.showBtnTitle")}
          </Button>
        </LegacyStack>
      </LegacyStack>
    </LegacyCard>
  );
};

export default CustomersShowHide;

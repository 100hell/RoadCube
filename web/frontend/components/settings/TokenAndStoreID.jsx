import React, { useEffect, useState } from "react";
import { LegacyCard, LegacyStack, TextField } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { _dispatch_UPDATE_SETTINGS_DETAILS } from "../../redux/actions/roadcubeActions";
import { useNavigate } from "react-router-dom";

const TokenAndStoreID = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetch = useAuthenticatedFetch();
  const navigate = useNavigate();

  const { settingsData, settingsDataLoading, updateSettingsDataLoading } =
    useSelector((states) => states.roadcube);

  const [inputToken, setInputToken] = useState("");
  const [inputTokenError, setInputTokenError] = useState(null);
  const [inputStoreID, setInputStoreID] = useState("");
  const [inputStoreIDError, setInputStoreIDError] = useState(null);

  useEffect(() => {
    setInputToken(settingsData?.roadcube_token || "");
    setInputTokenError(null);

    setInputStoreID(settingsData?.roadcube_store_id || "");
    setInputStoreIDError(null);
  }, [settingsData]);

  return (
    <LegacyCard
      title={t("settings.tokenStoreIDCard.title")}
      sectioned
      primaryFooterAction={{
        content: t("settings.tokenStoreIDCard.primaryBtnLabel"),
        onAction: () => {
          if (inputTokenError || inputStoreIDError) {
            return;
          } else if (
            !inputToken ||
            !inputToken.trim() ||
            !inputStoreID ||
            !inputStoreID.trim()
          ) {
            if (!inputToken.trim()) {
              setInputTokenError("Token cannot be empty");
            } else {
              setInputStoreIDError("Store ID cannot be empty");
            }

            return;
          }

          dispatch(
            _dispatch_UPDATE_SETTINGS_DETAILS({
              fetchFn: fetch,
              inputs: {
                loadingKey: "update_token_store_id_loading",
                roadcube_token: inputToken,
                roadcube_store_id: inputStoreID,
                type: "token-and-store-update",
              },
            })
          );
        },
        loading: updateSettingsDataLoading?.update_token_store_id_loading,
        disabled: settingsDataLoading,
      }}
    >
      <LegacyStack vertical>
        <TextField
          label={t("settings.tokenStoreIDCard.tokenLabel")}
          placeholder={t("settings.tokenStoreIDCard.tokenPlaceholder")}
          value={inputToken}
          onChange={(newvalue) => {
            setInputToken(newvalue);
            setInputTokenError(newvalue ? null : "Token cannot be empty");
          }}
          requiredIndicator
          error={inputTokenError}
        />
        <TextField
          label={t("settings.tokenStoreIDCard.storeIDLabel")}
          placeholder={t("settings.tokenStoreIDCard.storeIDPlaceholder")}
          value={inputStoreID}
          onChange={(newvalue) => {
            setInputStoreID(newvalue);
            setInputStoreIDError(newvalue ? null : "Store ID cannot be empty");
          }}
          requiredIndicator
          error={inputStoreIDError}
        />
      </LegacyStack>
    </LegacyCard>
  );
};

export default TokenAndStoreID;

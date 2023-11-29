import { Page, Layout, Frame, Loading } from "@shopify/polaris";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SettingsErrorSuccessBanner from "../components/settings/SettingsErrorSuccessBanner";
import TokenAndStoreID from "../components/settings/TokenAndStoreID";
import { _dispatch_GET_SETTINGS_DETAILS } from "../redux/actions/roadcubeActions";

export default function HomePage() {
  const navigate = useNavigate();

  const {
    settingsData,
    settingsDataLoading,
    settingPageBannerSuccessErrorMessage,
  } = useSelector((states) => states.roadcube);

  useEffect(() => {
    if (settingsData?.roadcube_token && settingsData?.roadcube_store_id) {
      navigate("/dashboard");
    }
  }, [settingsData]);

  return (
    <Frame>
      {settingsDataLoading && <Loading />}

      <Page narrowWidth>
        <Layout>
          {settingPageBannerSuccessErrorMessage &&
            settingPageBannerSuccessErrorMessage.status === "critical" && (
              <Layout.Section>
                <SettingsErrorSuccessBanner />
              </Layout.Section>
            )}
          <Layout.Section>
            <TokenAndStoreID />
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}

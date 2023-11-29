import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useNavigateToHome = () => {
  const navigate = useNavigate();

  const { settingsData, settingsDataLoading } = useSelector(
    (states) => states.roadcube
  );

  useEffect(() => {
    if (settingsDataLoading !== undefined) {
      if (!settingsData?.roadcube_token || !settingsData?.roadcube_store_id) {
        navigate("/");
      }
    }
  }, []);
};

export default useNavigateToHome;

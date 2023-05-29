"use client";

import { CenterScreen } from "@/components/molecules/CenterScreen";
import { CustomSpinner } from "@/components/molecules/CustomMolecules";

const LoadingPage = () => {
  return (
    <CenterScreen>
      <CustomSpinner animation="border" />
    </CenterScreen>
  );
};

export default LoadingPage;

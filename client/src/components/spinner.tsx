import { Loader } from "lucide-react";
import React from "react";

const Spinner: React.FC = (): JSX.Element => {
  return <Loader className="animate-spin w-5 h-5" />;
};

export default Spinner;

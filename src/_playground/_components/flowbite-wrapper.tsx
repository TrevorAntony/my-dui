import { Flowbite } from "flowbite-react";
import type { FC } from "react";
import { Outlet } from "react-router";
import theme from "../flowbite-theme";

//Tagging @TrevorAntony to check whether this component is still viable or if we should maintian the one in the index file
const FlowbiteWrapper: FC = function () {
  return (
    <Flowbite theme={{ theme }}>
      <Outlet />
    </Flowbite>
  );
};

export default FlowbiteWrapper;

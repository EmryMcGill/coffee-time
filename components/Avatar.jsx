import { Image } from "expo-image";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

const Avatar = ({
  uri,
  size = hp(4.5),
  rounded = theme.radius.md,
  style = {},
}) => {
  return (
    <Image
      source={uri}
      transition={100}
      style={[style, { height: size, width: size, borderRadius: rounded }]}
    />
  );
};

export default Avatar;

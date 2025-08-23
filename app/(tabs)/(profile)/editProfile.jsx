import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Camera, ChevronLeft, User } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";
import IconButton from "../../../components/IconButton";
import Input from "../../../components/Input";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { getAvatar, uploadFile } from "../../../services/imageService";
import { updateUser } from "../../../services/userService";

const EditProfile = () => {
  const router = useRouter();
  const { user, setAuth } = useAuth();
  const machineRef = useRef();
  const grinderRef = useRef();

  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    machine: "",
    grinder: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("user from edit", user);
    if (user) {
      setUpdatedUser({
        name: user.name,
        machine: user.machine,
        grinder: user.grinder,
        image: user.image,
      });
    }
  }, []);

  useEffect(() => {
    // console.log('change to updated user: ', updatedUser)
  }, [updatedUser]);

  const onSubmit = async () => {
    let userData = { ...updatedUser };
    // console.log(userData, user.id)
    let { name, machine, grinder, image } = userData;
    if (name === "" || machine === "" || grinder === "") {
      Alert.alert("Sign up", "Please fill all the fields");
      return;
    }

    setLoading(true);

    // check if image is picked
    if (typeof image === "object") {
      // upload the image to supabase
      const imageRes = await uploadFile("profiles", image?.uri, true);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    // update the user object in supabase
    const res = await updateUser(user.id, userData);
    setLoading(false);

    if (res.success) {
      setAuth({ ...user, ...userData });
      router.back();
    } else console.log(res.msg);
  };

  onPickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!res.canceled) {
      setUpdatedUser({ ...updatedUser, image: res.assets[0] });
    }
  };

  let imageSrc = getAvatar(updatedUser?.image).uri;

  return (
    <ScreenWrapper bg="white">
      <View style={{ flex: 1 }}>
        {/* ScrollView with content */}
        <ScrollView
          style={{ flex: 1 }}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={styles.container}
        >
          {/* profile image */}
          <View>
            <Avatar
              uri={imageSrc}
              size={hp(12)}
              rounded={theme.radius.xxl * 1.4}
            />
            <Pressable style={styles.editButton} onPress={onPickImage}>
              <Camera size={15} color={theme.colors.text} />
            </Pressable>
          </View>

          <Input
            icon={<User size={24} />}
            placeholder="Enter your username"
            onChangeText={(value) =>
              setUpdatedUser({ ...updatedUser, name: value })
            }
            value={updatedUser.name}
            returnKeyType="next"
            onSubmitEditing={() => machineRef.current?.focus()}
            autoCapitalize="none"
          />

          <Input
            icon={
              <Image
                source={require("../../../assets/images/machine.png")}
                style={styles.infoImg}
              />
            }
            placeholder="Enter your coffee machine"
            onChangeText={(value) =>
              setUpdatedUser({ ...updatedUser, machine: value })
            }
            value={updatedUser.machine}
            returnKeyType="next"
            onSubmitEditing={() => grinderRef.current?.focus()}
            autoCapitalize="none"
            ref={machineRef}
          />

          <Input
            icon={
              <Image
                source={require("../../../assets/images/grinder.png")}
                style={styles.infoImg}
              />
            }
            placeholder="Enter your coffee grinder"
            onChangeText={(value) =>
              setUpdatedUser({ ...updatedUser, grinder: value })
            }
            value={updatedUser.grinder}
            returnKeyType="done"
            ref={grinderRef}
          />

          <View style={{ width: "100%" }}>
            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
        </ScrollView>

        {/* Header overlay - positioned absolutely */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          <IconButton
            icon={<ChevronLeft size={28} color={theme.colors.text} />}
            onPress={() => router.back()}
            style={{ position: "absolute", left: wp(4) }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingHorizontal: wp(4),
    paddingTop: hp(8), // Add top padding to account for header
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(1),
    paddingBottom: hp(2),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  title: {
    fontSize: hp(3.3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  infoImg: {
    width: hp(4),
    height: hp(4),
  },
  editButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});

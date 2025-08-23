import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Bean,
  Camera,
  Coffee,
  Image as ImageIcon,
  NotebookPen,
  Scale,
  Timer,
  Trash,
  X,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Input from "../components/Input";
import PickerInput from "../components/PickerInput";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { hp, wp } from "../helpers/common";
import { getAllBrews, saveBrew } from "../services/brewService";
import { getAvatar } from "../services/imageService";

const CreateBrew = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { brew } = useLocalSearchParams();
  const [lastBrew, setLastBrew] = useState();
  const [parsedBrew, setParsedBrew] = useState(brew ? JSON.parse(brew) : null);

  // Create refs for inputs
  const grindSizeRef = useRef(null);
  const doseWeightRef = useRef(null);
  const yieldWeightRef = useRef(null);
  const notesRef = useRef(null);

  const [brewType, setBrewType] = useState(parsedBrew?.brewType || "");
  const [beanType, setBeanType] = useState(parsedBrew?.beanType || "");
  const [doseWeight, setDoseWeight] = useState(parsedBrew?.doseWeight || null);
  const [yieldWeight, setYieldWeight] = useState(
    parsedBrew?.yieldWeight || null
  );
  const [brewTime, setBrewTime] = useState(parsedBrew?.brewTime || null);
  const [grindSize, setGrindSize] = useState(parsedBrew?.grindSize || null);
  const [notes, setNotes] = useState(parsedBrew?.notes || "");
  const [image, setImage] = useState(parsedBrew?.image || null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLastBrew();
  }, [user]);

  useEffect(() => {
    setBrewType(lastBrew?.brewType || "");
    setBeanType(lastBrew?.beanType || "");
    setDoseWeight(lastBrew?.doseWeight ?? null);
    setYieldWeight(lastBrew?.yieldWeight ?? null);
    setBrewTime(null);
    setGrindSize(lastBrew?.grindSize ?? null);
    setNotes("");
    setImage(null);
  }, [lastBrew]);

  const getLastBrew = async () => {
    const res = await getAllBrews(user.id);
    if (res.success) {
      setLastBrew(res.data[res.data.length - 1]);
    }
  };

  const onSubmit = async () => {
    if (brewType === "") {
      Alert.alert("Error", "Please enter a brew type");
      return;
    }

    let data = {
      user: user.id,
      brewType,
      beanType,
      doseWeight,
      yieldWeight,
      brewTime,
      grindSize,
      notes,
      image,
      id: parsedBrew?.id,
    };

    setLoading(true);
    const res = await saveBrew(data);
    setLoading(false);

    // Handle response
    if (res.success) {
      onCancel(true); // Reset form and go back
    } else {
      Alert.alert("Error", res.msg || "Failed to save brew");
    }
  };

  const onPickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!res.canceled) {
        setImage(res.assets[0]);
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Failed to access photo library");
    }
  };

  const onOpenCamera = async () => {
    try {
      let { status } = await ImagePicker.getCameraPermissionsAsync();

      if (status !== "granted") {
        const { status: newStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        status = newStatus;
      }

      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to take photos.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const onCancel = (isCreated) => {
    setParsedBrew(null);
    setBrewType(lastBrew?.brewType || "");
    setBeanType(lastBrew?.beanType || "");
    setDoseWeight(lastBrew?.doseWeight ?? null);
    setYieldWeight(lastBrew?.yieldWeight ?? null);
    setBrewTime(null);
    setGrindSize(lastBrew?.grindSize ?? null);
    setNotes("");
    setImage(null);

    if (isCreated) router.replace("/(tabs)?refresh=true");
    else router.back();
  };

  return (
    <ScreenWrapper bg="white">
      <ScrollView
        style={{ flex: 1 }}
        automaticallyAdjustKeyboardInsets={true}
        contentContainerStyle={styles.container}
      >
        <PickerInput
          icon={<Coffee size={24} color={theme.colors.text} />}
          placeholder="Brew Type"
          value={brewType}
          setValue={setBrewType}
          title="Select Brew Type"
          type="options"
          options={[
            "Espresso",
            "Pour Over",
            "French Press",
            "Aeropress",
            "Cold Brew",
            "Siphon",
            "Moka Pot",
            "Turkish Coffee",
            "Nitro Cold Brew",
            "Chemex",
            "V60",
            "Kalita Wave",
            "Clever Dripper",
            "Percolator",
            "Steampunk",
            "Syphon",
            "Drip Coffee",
            "Single Serve Pod",
            "Nitro Coffee",
            "Coffee Bag",
          ]}
        />

        <PickerInput
          icon={<Bean size={24} color={theme.colors.text} />}
          placeholder="Bean Type"
          value={beanType}
          type="options"
          options={["Arabica", "Robusta", "Liberica", "Excelsa", "Blend"]}
          title="Select Bean Type"
          setValue={setBeanType}
        />

        <Input
          ref={grindSizeRef}
          icon={
            <Image
              style={{ width: hp(4), height: hp(4) }}
              source={require("../assets/images/grinder.png")}
            />
          }
          placeholder="Grind Size"
          value={grindSize}
          onChangeText={setGrindSize}
          returnKeyType="next"
          keyboardType="numeric"
          onSubmitEditing={() => doseWeightRef.current?.focus()}
        />

        <Input
          ref={doseWeightRef}
          icon={<Scale size={24} color={theme.colors.text} />}
          placeholder="Dose Weight (g)"
          value={doseWeight}
          onChangeText={setDoseWeight}
          keyboardType="numeric"
          returnKeyType="next"
        />

        <PickerInput
          icon={<Timer size={24} color={theme.colors.text} />}
          placeholder="Brew Time (s)"
          title="Select Brew Time (s)"
          value={brewTime}
          setValue={setBrewTime}
          type="timer"
        />

        <Input
          ref={yieldWeightRef}
          icon={<Scale size={24} color={theme.colors.text} />}
          placeholder="Yield Weight (g)"
          value={yieldWeight}
          onChangeText={setYieldWeight}
          keyboardType="numeric"
          returnKeyType="next"
          onSubmitEditing={() => notesRef.current?.focus()}
        />

        {image && (
          <View style={styles.imageContainer}>
            <Image
              source={getAvatar(image)}
              transition={100}
              style={styles.image}
              contentFit="cover"
            />
            <Pressable
              style={styles.trashButton}
              onPress={() => setImage(null)}
            >
              <Trash color="white" />
            </Pressable>
          </View>
        )}

        <View style={styles.media}>
          <Text style={styles.addPhotoText}>
            {!image ? "Add Photo" : "Change Photo"}
          </Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Pressable onPress={onPickImage}>
              <ImageIcon />
            </Pressable>
            <Pressable onPress={onOpenCamera}>
              <Camera />
            </Pressable>
          </View>
        </View>

        <Input
          ref={notesRef}
          icon={<NotebookPen size={24} color={theme.colors.text} />}
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          returnKeyType="done"
          multiline
          containerStyles={{
            height: hp(20),
            alignItems: "flex-start",
            paddingTop: 18,
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title={brew ? "Update Brew" : "Create Brew"}
          onPress={onSubmit}
          loading={loading}
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{brew ? "Update Brew" : "Create Brew"}</Text>
        <IconButton
          icon={<X size={28} />}
          onPress={() => onCancel(false)}
          style={{ position: "absolute", left: wp(4), top: wp(4) }}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CreateBrew;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 20,
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    paddingBottom: hp(4),
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: wp(6),
    paddingBottom: wp(6),
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: hp(3.3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  media: {
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.gray,
    padding: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  addPhotoText: {
    color: theme.colors.text,
    fontSize: hp(2.2),
    fontWeight: theme.fonts.medium,
  },
  imageContainer: {
    height: hp(30),
    width: "100%",
  },
  image: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  trashButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: theme.colors.rose,
    padding: 5,
    borderRadius: theme.radius.md,
  },
  buttonContainer: {
    width: "100%",
    padding: wp(4),
    paddingBottom: hp(4),
    borderTopColor: theme.colors.gray,
    borderTopWidth: 0.5,
  },
});

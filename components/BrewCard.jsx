import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SquarePen } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { getAvatar } from "../services/imageService";
import Avatar from "./Avatar";

const BrewCard = ({ brew }) => {
  const router = useRouter();

  useEffect(() => {
    // console.log(brew)
  }, [brew]);

  const formatTime = (timeString) => {
    if (!timeString) return null;
    const date = new Date(timeString);
    return (
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const formatWeight = (weight) => {
    return weight ? `${weight}g` : "Not specified";
  };

  const formatTime2 = (time) => {
    return time ? `${time}s` : "Not specified";
  };

  return (
    <View style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        <Avatar
          uri={getAvatar(brew?.user?.image)}
          size={hp(4.3)}
          rounded={theme.radius.sm}
        />
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{brew?.user?.name}</Text>
          <Text style={styles.timeText}>{formatTime(brew?.created_at)}</Text>
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/createBrew",
              params: { brew: JSON.stringify(brew) },
            })
          }
        >
          <SquarePen size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Brew Details */}
      <View style={styles.brewDetails}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.brewTypeText}>{brew?.brewType}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../assets/images/bean.png")}
              style={{ height: wp(8), width: wp(8) }}
            />
            <Text style={styles.beanText}>{brew.beanType}</Text>
          </View>
        </View>

        {/* Notes */}
        {brew?.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{brew.notes}</Text>
          </View>
        )}

        {/* Brew specs in a grid */}
        <View style={styles.specsContainer}>
          {brew?.doseWeight && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Dose</Text>
              <Text style={styles.specValue}>
                {formatWeight(brew.doseWeight)}
              </Text>
            </View>
          )}
          {brew?.yieldWeight && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Yield</Text>
              <Text style={styles.specValue}>
                {formatWeight(brew.yieldWeight)}
              </Text>
            </View>
          )}
          {brew?.brewTime && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Time</Text>
              <Text style={styles.specValue}>{formatTime2(brew.brewTime)}</Text>
            </View>
          )}
          {brew?.grindSize && (
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Grind</Text>
              <Text style={styles.specValue}>{brew.grindSize}</Text>
            </View>
          )}
        </View>

        {/* Brew Image */}
        {brew?.image && (
          <View style={styles.imageContainer}>
            <Image source={getAvatar(brew.image)} style={styles.brewImage} />
          </View>
        )}
      </View>
    </View>
  );
};

export default BrewCard;

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  userInfo: {
    flex: 1,
  },
  nameText: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  timeText: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    marginTop: 2,
  },
  imageContainer: {
    borderRadius: theme.radius.sm,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  brewImage: {
    width: "100%",
    height: hp(25),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
  },
  brewDetails: {
    gap: 8,
  },
  brewTypeText: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  beanText: {
    fontSize: hp(2.5),
    color: theme.colors.text,
  },
  specsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  specItem: {
    backgroundColor: "#f8f9fa",
    flex: 1,
    maxWidth: wp(20),
    paddingVertical: hp(1.2),
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  specLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
    marginBottom: 2,
  },
  specValue: {
    fontSize: hp(1.9),
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold,
  },
  notesContainer: {
    backgroundColor: theme.colors.gray + "10",
    borderRadius: theme.radius.sm,
  },
  notesText: {
    fontSize: hp(2),
    color: theme.colors.text,
  },
});

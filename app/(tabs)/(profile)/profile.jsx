import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Settings, SquarePen, UserPlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Avatar from "../../../components/Avatar";
import BrewCard from "../../../components/BrewCard";
import IconButton from "../../../components/IconButton";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import { hp, wp } from "../../../helpers/common";
import { logout } from "../../../services/authService";
import { getMyBrews } from "../../../services/brewService";
import { getAvatar } from "../../../services/imageService";
import { getAllFriends } from "../../../services/userService";

const Profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  const [toggle, setToggle] = useState("brews");
  const [brews, setBrews] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getBrews();
    getFriends();
  }, []);

  const getBrews = async () => {
    const res = await getMyBrews(user.id);
    if (res.success) {
      setBrews(res.data);
    }
  };

  const getFriends = async () => {
    const res = await getAllFriends(user.id);
    if (res.success) {
      setFriends(res.data);
    }
  };

  const onLogout = async () => {
    const res = await logout();

    if (res.success) setAuth(null);
    else console.log(res.msg);
  };

  return (
    <ScreenWrapper bg="white">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon={<UserPlus size={28} color={theme.colors.text} />}
            onPress={() => router.push("/addFriends")}
            style={{ position: "absolute", left: wp(4) }}
          />
          <Text style={styles.title}>Profile</Text>
          <IconButton
            icon={<Settings size={28} color={theme.colors.text} />}
            onPress={onLogout}
            style={styles.settingsButton}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Avatar
                    uri={getAvatar(user?.image).uri}
                    size={hp(15)}
                    rounded={theme.radius.xxl * 1.4}
                  />
                  <Pressable
                    style={styles.editButton}
                    onPress={() => router.push("/editProfile")}
                  >
                    <SquarePen size={14} color={theme.colors.primary} />
                  </Pressable>
                </View>
                <Text style={styles.username}>{user?.name}</Text>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{brews.length}</Text>
                    <Text style={styles.statLabel}>Brews</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{friends.length}</Text>
                    <Text style={styles.statLabel}>Friends</Text>
                  </View>
                </View>
              </View>

              {/* Equipment Section */}
              <View style={styles.equipmentSection}>
                <View style={styles.equipmentGrid}>
                  <View style={styles.equipmentCard}>
                    <View style={styles.equipmentIcon}>
                      <Image
                        source={require("../../../assets/images/machine.png")}
                        style={styles.equipmentImg}
                        contentFit="contain"
                      />
                    </View>
                    <View style={styles.equipmentInfo}>
                      <Text style={styles.equipmentLabel}>Machine</Text>
                      <Text style={styles.equipmentText}>
                        {user?.machine || "Not specified"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.equipmentCard}>
                    <View style={styles.equipmentIcon}>
                      <Image
                        source={require("../../../assets/images/grinder.png")}
                        style={styles.equipmentImg}
                        contentFit="contain"
                      />
                    </View>
                    <View style={styles.equipmentInfo}>
                      <Text style={styles.equipmentLabel}>Grinder</Text>
                      <Text style={styles.equipmentText}>
                        {user?.grinder || "Not specified"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* toggle */}
            <View style={styles.toggleContainer}>
              <View style={styles.toggleInnerContainer}>
                <Pressable
                  onPress={() => setToggle("brews")}
                  style={[
                    styles.toggleButton,
                    toggle === "brews"
                      ? { backgroundColor: theme.colors.primary }
                      : "",
                  ]}
                >
                  <Text
                    style={[
                      toggle === "brews" ? { color: "white" } : "",
                      { fontWeight: theme.fonts.semibold },
                    ]}
                  >
                    My Brews
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setToggle("stats")}
                  style={[
                    styles.toggleButton,
                    toggle === "stats"
                      ? { backgroundColor: theme.colors.primary }
                      : "",
                  ]}
                >
                  <Text
                    style={[
                      toggle === "stats" ? { color: "white" } : "",
                      { fontWeight: theme.fonts.semibold },
                    ]}
                  >
                    Stats
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* my brews */}
            {brews.map((brew, index) => (
              <BrewCard brew={brew} key={index} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(8),
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
    fontSize: hp(3.2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  settingsButton: {
    position: "absolute",
    right: wp(4),
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: wp(6),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: hp(1),
  },
  avatarContainer: {
    position: "relative",
    marginBottom: hp(1.5),
  },
  editButton: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  username: {
    color: theme.colors.text,
    fontSize: hp(2.8),
    fontWeight: theme.fonts.bold,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: hp(1.8),
    fontWeight: theme.fonts.medium,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  equipmentGrid: {
    gap: hp(1.5),
  },
  equipmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: wp(4),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  equipmentIcon: {
    width: hp(5),
    height: hp(5),
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  equipmentImg: {
    width: hp(3),
    height: hp(3),
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
    marginBottom: 2,
  },
  equipmentText: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
  },
  toggleContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: wp(0),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: hp(2),
  },
  toggleInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  toggleButton: {
    padding: wp(3),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    width: "40%",
  },
  statsSection: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: wp(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: hp(2),
  },
  statsTitle: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    marginBottom: hp(2),
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: hp(3),
    fontWeight: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 30,
    marginVertical: 5,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: hp(2.5),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    marginTop: 2,
  },
});

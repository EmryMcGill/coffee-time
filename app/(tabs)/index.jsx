import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BrewCard from "../../components/BrewCard";
import ScreenWrapper from "../../components/ScreenWrapper";
import { theme } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { hp, wp } from "../../helpers/common";
import { getAllBrews } from "../../services/brewService";

const Index = () => {
  const { user, setAuth } = useAuth();
  const [brews, setBrews] = useState([]);
  const params = useSearchParams();

  useEffect(() => {
    if (params.refresh === "true") {
      console.log("new brew");
      getBrews();
    }
  }, [params.refresh]);

  useEffect(() => {
    getBrews();
  }, [user]);

  useEffect(() => {
    // console.log(brews)
  }, [brews]);

  const getBrews = async () => {
    const res = await getAllBrews(user.id);
    if (res.success) {
      setBrews(res.data);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hot Mud</Text>
        </View>
        <FlatList
          style={styles.brewContainer}
          data={brews}
          renderItem={({ item }) => <BrewCard brew={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Index;

const styles = StyleSheet.create({
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
  brewContainer: {
    paddingHorizontal: wp(4),
    paddingTop: hp(8),
  },
});

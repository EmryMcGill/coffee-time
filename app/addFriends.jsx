import { useRouter } from "expo-router";
import { Search, UserPlus, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { useAuth } from "../contexts/AuthContext";
import { hp, wp } from "../helpers/common";
import { getAvatar } from "../services/imageService";
import {
  acceptFriendRequest,
  getAllFriends,
  getAllRequests,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "../services/userService";

const AddFriends = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllRequestsFunc();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      searchForUsers();
    } else {
      setUsers([]);
    }
  }, [searchQuery]);

  const searchForUsers = async () => {
    setLoading(true);
    try {
      const res = await searchUsers(searchQuery.trim(), user.id);
      if (res.success) {
        setUsers(res.data || []);
      } else {
        Alert.alert("Error", res.msg || "Failed to search users");
      }
    } catch (error) {
      console.log("Search error:", error);
      Alert.alert("Error", "Failed to search users");
    }
    setLoading(false);
  };

  const getAllRequestsFunc = async () => {
    try {
      const res = await getAllRequests(user.id);
      // Check if the request was successful and has data
      if (res.success && res.data) {
        const receiverIds = res.data.map((item) => item.receiver_id);
        setPendingRequests(
          res.data.filter((item) => item.receiver_id === user.id)
        );
        setFriendRequests(receiverIds);
      } else {
        console.log("Error getting requests:", res.msg);
        setFriendRequests([]);
      }
    } catch (error) {
      console.log("Error in getAllRequestsFunc:", error);
      setFriendRequests([]);
    }
    const friends = await getAllFriends(user.id);
    setFriends(
      friends.data.map((friend) => {
        return friend.user1_id === user.id ? friend.user2_id : friend.user1_id;
      })
    );
  };

  const handleSendFriendRequest = async (targetUserId, targetUserName) => {
    try {
      const res = await sendFriendRequest(user, targetUserId);
      if (res.success) {
        Alert.alert("Success", `Friend request sent to ${targetUserName}!`);
        getAllRequestsFunc();
      } else {
        Alert.alert("Error", res.msg || "Failed to send friend request");
      }
    } catch (error) {
      console.log("Friend request error:", error);
      Alert.alert("Error", "Failed to send friend request");
    }

    setRequestingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(targetUserId);
      return newSet;
    });
  };

  const handleAcceptFriendRequest = async (
    requestId,
    targetUserId,
    targetUserName
  ) => {
    try {
      const res = await acceptFriendRequest(user, requestId, targetUserId);
      if (res.success) {
        Alert.alert("Success", `You are now friends with ${targetUserName}!`);
        getAllRequestsFunc();
      } else {
        Alert.alert("Error", res.msg || "Failed to become friends.");
      }
    } catch (error) {
      console.log("Friend request error:", error);
      Alert.alert("Error", "Failed to send friend request");
    }

    setRequestingUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(targetUserId);
      return newSet;
    });
  };

  const handleRemoveFriend = async (friend_id, friend_name) => {
    const res = await removeFriend(friend_id, user.id);
    if (res.success) {
      Alert.alert("Success", `You are no longer friends with ${friend_name}!`);
      getAllRequestsFunc();
    } else {
      Alert.alert("Error", res.msg || "Failed to remove friend.");
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Avatar
          uri={getAvatar(item?.image)}
          size={hp(6)}
          rounded={theme.radius.md}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          {item.email && <Text style={styles.userEmail}>{item.email}</Text>}
        </View>
      </View>

      <Button
        title={
          friendRequests.includes(item.id)
            ? "Request Sent"
            : friends.includes(item.id)
            ? "Remove Friend"
            : "Add Friend"
        }
        onPress={
          friendRequests.includes(item.id)
            ? null
            : friends.includes(item.id)
            ? () => handleRemoveFriend(item.id, item.name)
            : () => handleSendFriendRequest(item.id, item.name)
        }
        loading={false}
        buttonStyle={
          friendRequests.includes(item.id)
            ? styles.addButtonSent
            : styles.addButton
        }
        textStyle={
          friendRequests.includes(item.id)
            ? styles.addButtonTextSent
            : styles.addButtonText
        }
        hasShadow={false}
      />
    </View>
  );

  const renderPendingRequest = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Avatar
          uri={getAvatar(item?.requesterImage)}
          size={hp(6)}
          rounded={theme.radius.md}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.requesterName}</Text>
        </View>
      </View>

      <Button
        title="Accept Request"
        onPress={
          friendRequests.includes(item.id)
            ? null
            : () =>
                handleAcceptFriendRequest(
                  item.id,
                  item.requester_id,
                  item.requesterName
                )
        }
        loading={false}
        buttonStyle={
          friendRequests.includes(item.id)
            ? styles.addButtonSent
            : styles.addButton
        }
        textStyle={
          friendRequests.includes(item.id)
            ? styles.addButtonTextSent
            : styles.addButtonText
        }
        hasShadow={false}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) return null;

    if (searchQuery.trim() === "") {
      return (
        <View style={styles.emptyState}>
          <Search size={48} color={theme.colors.textLight} />
          <Text style={styles.emptyStateText}>
            Search for friends by name or email
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Type at least 2 characters to start searching
          </Text>
        </View>
      );
    }

    if (users.length === 0) {
      return (
        <View style={styles.emptyState}>
          <UserPlus size={48} color={theme.colors.textLight} />
          <Text style={styles.emptyStateText}>No users found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try a different search term
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <ScreenWrapper bg="white">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Friends</Text>
        <IconButton
          icon={<X size={28} />}
          onPress={() => router.back()}
          style={{ position: "absolute", left: wp(4), top: wp(4) }}
        />
      </View>

      <View style={styles.container}>
        {/* pending requests */}
        {pendingRequests.length > 0 ? (
          <View style={styles.pendingRequestsContainer}>
            <Text
              style={{ marginLeft: wp(4), fontWeight: theme.fonts.semibold }}
            >
              Pending Requests
            </Text>
            <View style={styles.listContainer}>
              <FlatList
                data={pendingRequests}
                renderItem={renderPendingRequest}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          </View>
        ) : (
          ""
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={theme.colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textLight}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={20} color={theme.colors.textLight} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Users List */}
        <View style={styles.listContainer}>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddFriends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(4),
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
  searchContainer: {
    paddingHorizontal: wp(4),
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.xl,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    color: theme.colors.text,
  },
  listContainer: {
    paddingHorizontal: wp(4),
  },
  listContent: {
    paddingVertical: hp(1),
    flexGrow: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: theme.radius.xl,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: hp(2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
    marginTop: 2,
  },
  addButton: {
    paddingHorizontal: 16,
    minWidth: wp(20),
    borderRadius: theme.radius.sm,
  },
  addButtonSent: {
    paddingHorizontal: 16,
    minWidth: wp(20),
    borderRadius: theme.radius.sm,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
  },
  addButtonText: {
    fontSize: hp(1.9),
  },
  addButtonTextSent: {
    fontSize: hp(1.9),
    color: theme.colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(10),
  },
  emptyStateText: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: hp(1.8),
    color: theme.colors.textLight,
    marginTop: 8,
    textAlign: "center",
  },
});

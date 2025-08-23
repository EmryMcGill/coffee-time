import { supabase } from "../lib/supabase";

export const getUserById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      return { success: false, msg: error.message };
    } else {
      return { success: true, data };
    }
  } catch (err) {
    console.log(err);
    return { success: false, msg: err.message };
  }
};

export const updateUser = async (id, data) => {
  const { error } = await supabase.from("users").update(data).eq("id", id);

  if (error) {
    return { success: false, msg: error.message };
  } else {
    return { success: true, data };
  }
};

export const searchUsers = async (query, currentUserId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, image")
      .neq("id", currentUserId)
      .ilike("name", `%${query}%`)
      .limit(20);

    if (error) {
      console.log(error);
      return { success: false, msg: "Search failed" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "Search failed" };
  }
};

export const sendFriendRequest = async (currentUser, receiver_id) => {
  try {
    const { data, error } = await supabase.from("friend_requests").insert({
      requester_id: currentUser.id,
      requesterName: currentUser.name,
      requesterImage: currentUser.image,
      receiver_id,
    });

    if (error) {
      console.log(error);
      return { success: false, msg: "failed to send friend request" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "failed to send friend request" };
  }
};

export const acceptFriendRequest = async (user, requestId, requesterId) => {
  try {
    const { data, error } = await supabase.from("friends").insert({
      user1_id: user.id,
      user2_id: requesterId,
    });

    if (error) {
      console.log(error);
      return { success: false, msg: "failed to send friend request" };
    }

    try {
      await supabase.from("friend_requests").delete().eq("id", requestId);
    } catch (err) {
      console.log(err);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "failed to send friend request" };
  }
};

export const getAllRequests = async (id) => {
  try {
    const { data, error } = await supabase
      .from("friend_requests")
      .select("id, receiver_id, requester_id, requesterImage, requesterName")
      .or(`requester_id.eq.${id},receiver_id.eq.${id}`);

    if (error) {
      console.log(error);
      return { success: false, msg: "failed to get all friend requests" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "failed to get all friend requests" };
  }
};

export const getAllFriends = async (id) => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("user1_id, user2_id")
      .or(`user1_id.eq.${id},user2_id.eq.${id}`);

    if (error) {
      console.log(error);
      return { success: false, msg: "failed to get all friends" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "failed to get all friends" };
  }
};

export const removeFriend = async (friendId, userId) => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .delete()
      .or(
        `and(user1_id.eq.${userId},user2_id.eq.${friendId}),and(user1_id.eq.${friendId},user2_id.eq.${userId})`
      );

    if (error) {
      console.log(error);
      return { success: false, msg: "failed to get all friends" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "failed to get all friends" };
  }
};

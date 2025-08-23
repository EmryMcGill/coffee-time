import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const saveBrew = async (brew) => {
  try {
    console.log(brew.image);
    if (brew.image && !brew.image.startsWith("profiles/")) {
      // upload image
      const imageRes = await uploadFile("profiles", brew.image?.uri, true);
      if (imageRes.success) brew.image = imageRes.data;
      else return imageRes;
    }

    // upload brew
    const { data, error } = await supabase
      .from("brews")
      .upsert(brew)
      .select()
      .single();

    if (error) {
      console.log("error saving brew", error);
      return { success: false, msg: "could not create post" };
    }

    return { success: true, data: data };
  } catch (err) {
    console.log("error saving brew", err);
    return { success: false, msg: "could not create post" };
  }
};

export const getAllBrews = async (userId, limit = 10) => {
  try {
    // Step 1: Get list of friend IDs
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("user1_id, user2_id")
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (friendsError) {
      console.log("error getting friends", friendsError);
      return { success: false, msg: "error getting friends" };
    }

    // Step 2: Extract friend IDs
    const friendIds =
      friendsData?.map((friend) => {
        return friend.user1_id === userId ? friend.user2_id : friend.user1_id;
      }) || [];

    // Include current user in list
    const userAndFriendIds = [userId, ...friendIds];

    // Step 3: Get brews from current user or friends
    const { data, error } = await supabase
      .from("brews")
      .select("*, user: users (id, name, image)")
      .in("user", userAndFriendIds)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("error getting brews", error);
      return { success: false, msg: "error getting brews" };
    }

    return { success: true, data };
  } catch (error) {
    console.log("error getting brews", error);
    return { success: false, msg: "error getting brews" };
  }
};

export const getMyBrews = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("brews")
      .select("*, user: users (id, name, image)")
      .eq("user", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("error getting all posts", error);
      return { success: false, msg: "error getting all posts" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("error getting all posts", error);
    return { success: false, msg: "error getting all posts" };
  }
};

import { account, appwriteConfig, database } from "~/appwrite/client";
import { ID, OAuthProvider, Query } from "appwrite";
import { redirect } from "react-router";

const { databaseId, userCollectionId } = appwriteConfig;

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(OAuthProvider.Google);
  } catch (error) {
    console.log("loginWithGoogle", error);
  }
};

export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) return redirect("/sign-in");

    const { documents } = await database.listDocuments(
      databaseId,
      userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ],
    );

    if (documents.length > 0) {
      return documents[0];
    }

    // If user is authenticated but not in database, store user data
    return await storeUserData();
  } catch (error) {
    console.log("getUser error:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.log("logoutUser error:", error);
    return false;
  }
};

export const getGooglePicture = async () => {
  try {
    const session = await account.getSession("current");
    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      console.log("No OAuth token available");
      return null;
    }

    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
      },
    );
    if (!response.ok) {
      console.log("Error fetching profile picture from Google People API");
      return null;
    }
    const data = await response.json();
    const photoUrl =
      data.photos && data.photos.length > 0 ? data.photos[0].url : null;

    return photoUrl;
  } catch (error) {
    console.log("getGooglePicture error:", error);
    return null;
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();

    if (!user) return null;

    // Check if user already exists in the database
    const existingUser = await getExistingUser(user.$id);

    if (existingUser) {
      return existingUser;
    }

    // Get profile picture from Google
    const imageUrl = (await getGooglePicture()) || "";

    // Create new user document
    const newUser = await database.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: imageUrl,
        joinedAt: new Date().toISOString(),
      },
    );

    return newUser;
  } catch (error) {
    console.log("storeUserData error:", error);
    return null;
  }
};

export const getExistingUser = async (accountId: string) => {
  try {
    const { documents } = await database.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", accountId)],
    );

    if (documents.length > 0) {
      return documents[0];
    }

    return null;
  } catch (error) {
    console.log("getExistingUser error:", error);
    return null;
  }
};

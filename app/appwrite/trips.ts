import { appwriteConfig, database } from "~/appwrite/client";
import { Query } from "appwrite";

export const getAllTrips = async (limit: number, offset: number) => {
  try {
    const allTrips = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")],
    );

    if (allTrips.total === 0) {
      console.info("No trips found");
      return { allTrips: [], total: 0 };
    }

    return {
      allTrips: allTrips.documents,
      total: allTrips.total,
    };
  } catch (error) {
    console.log("Error fetching trips");
    return { allTrips: [], total: 0 };
  }
};

export const getTripById = async (tripId: string) => {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.tripCollectionId,
      tripId,
    );
  } catch (error: any) {
    // Appwrite returns specific error codes we can check
    if (error?.code === 404) {
      console.info("Trip not found");
    } else {
      console.error("Error fetching trip:", error);
    }
    return null;
  }
};

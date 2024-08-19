import { useRuntimeConfig } from "#app";
import * as Realm from "realm-web";

export const useRealmApp = () => {
    const appId = useRuntimeConfig().public.realmAppId;
    const app = new Realm.App(appId);
    let currentUser = app.currentUser;
    let mongo = app?.currentUser?.mongoClient("mongodb-atlas");
  
    const loginApiKey = async () => {
      const apiKey = useRuntimeConfig()?.public.realmApiKey;
      const credentials = Realm?.Credentials?.apiKey(apiKey);
      currentUser = await app?.logIn(credentials);
      mongo = currentUser?.mongoClient("mongodb-atlas");
      return currentUser;
    };
  
    const getCollection = (dbName, collectionName) => {
      return mongo?.db(dbName)?.collection(collectionName);
    };
  
    const addDocument = async (dbName, collectionName, document) => {
      const collection = getCollection(dbName, collectionName);
      try {
        const result = await collection?.insertOne(document);
        return result?.insertedId;
      } catch (error) {
        console.error("Error adding document:", error);
        throw error;
      }
    };
  
    const updateDocument = async (dbName, collectionName, query, update) => {
      const collection = getCollection(dbName, collectionName);
      try {
        const result = await collection?.updateOne(query, { $set: update });
        return result?.matchedCount;
      } catch (error) {
        console.error("Error updating document:", error);
        throw error;
      }
    };
  
    const findDocuments = async (dbName, collectionName, query = {}) => {
      const collection = getCollection(dbName, collectionName);
      try {
        const documents = await collection?.find(query);
        return documents;
      } catch (error) {
        console.error("Error finding documents:", error);
        throw error;
      }
    };
  
    const deleteDocument = async (dbName, collectionName, query) => {
      const collection = getCollection(dbName, collectionName);
      try {
        const result = await collection?.deleteOne(query);
        return result?.deletedCount;
      } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
      }
    };
  
    return {
      loginApiKey,
      addDocument,
      updateDocument,
      findDocuments,
      deleteDocument
    };
};

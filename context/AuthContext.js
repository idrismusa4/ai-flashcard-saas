"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (isLoaded && isSignedIn) {
      const userDocRef = doc(db, "users", user.id);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // If user does not exist in Firestore, create a new document
        const newUser = {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt.toISOString(),
          plan: "free",
          planActive: false,
          planStartDate: new Date(),
          flashcardSets: [],
        };

        await setDoc(userDocRef, newUser);
        setUserData(newUser);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user, isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ user, userData, isLoaded, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

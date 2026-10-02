"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "./supabaseClient";

export default function SyncUserToSupabase() {
  const { user } = useUser();

  useEffect(() => {
    async function syncUser() {
      if (user) {
        const userData = {
          id: user.id,
          created_at: new Date().toISOString(),
          name: user.firstName || user.fullName,
          picture: user.imageUrl,
          
          credits: 10,
          email: user.emailAddresses[0]?.emailAddress, // default value; change if needed
        };

        try {
          const { data, error } = await supabase
            .from("Users")
            .upsert([userData], { onConflict: "id" });

          if (error) {
            console.error("Supabase sync error:", error);
          } else {
            console.log("User synced to Supabase ✅", data);
          }
        } catch (err) {
          console.error("Unexpected error during Supabase sync:", err);
        }
      }
    }
    syncUser();
  }, [user]);

  return null;
}

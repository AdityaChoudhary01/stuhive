"use server";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { indexNewContent } from "@/lib/googleIndexing"; 
import { pingIndexNow } from "@/lib/indexnow"; // 🚀 ADDED: IndexNow Integration

const APP_URL = process.env.NEXTAUTH_URL || "https://stuhive.in"; // 🚀 ADDED: Base URL for IndexNow

export async function registerUser(formData) {
  await connectDB();

  try {
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: "Email is already registered" };
    }

    // 🚀 THE FIX: Pass the plain-text password directly. 
    // Mongoose's pre('save') hook will hash it exactly once.
    const newUser = new User({
      name,
      email,
      password, // <--- Plain text goes here
    });

    await newUser.save(); // <--- Mongoose hashes it here

    // 🚀 SEO: Instantly ping Google & IndexNow to index the new public profile!
    // Notice we DO NOT 'await' these. They run in the background so the user doesn't have to wait.
    
    // 1. Google Ping
    indexNewContent(newUser._id.toString(), 'profile')
      .then(status => console.log(`[SEO] Google Profile Ping: ${status ? 'DELIVERED' : 'FAILED'}`))
      .catch(err => console.error(`[SEO] Google Profile Ping Error:`, err));
    
    // 2. IndexNow Ping (Bing, Yahoo, Yandex, etc.)
    pingIndexNow([`${APP_URL}/profile/${newUser._id.toString()}`])
      .then(status => console.log(`[SEO] IndexNow Profile Ping: ${status ? 'DELIVERED' : 'FAILED'}`))
      .catch(err => console.error(`[SEO] IndexNow Profile Ping Error:`, err));
    
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong during registration" };
  }
}
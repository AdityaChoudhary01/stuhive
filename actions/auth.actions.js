"use server";

import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { indexNewContent } from "@/lib/googleIndexing"; // 🚀 Import the SEO Indexer

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

    // 🚀 SEO: Instantly ping Google to index the new public profile!
    // Notice we DO NOT 'await' this. It runs in the background.
    indexNewContent(newUser._id.toString(), 'profile')
      .then(status => console.log(`[SEO] Profile indexed: ${status}`))
      .catch(err => console.error(`[SEO] Profile indexing failed:`, err));
    
    return { success: true };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "Something went wrong during registration" };
  }
}
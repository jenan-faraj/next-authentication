// /controllers/userController.js

import User from "../models/User";

export async function getUsers() {
  const users = await User.find({ isDeleted: false });
  return users;
}

export async function createUser(data) {
  const { name, email } = data;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const newUser = new User({ name, email });
  await newUser.save();
  return newUser;
}

export async function updateUser(id, data) {
  const { name, email } = data;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
}

export async function deleteUser(id) {
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
}

"use client";

import { useState } from "react";
import { LoadingScreenSection } from "../LoadingScreen";
import { useRouter } from "next/navigation";
import { createNewUser } from "@/api/userListsData";

const SignupPassenger = () => {
  const [loading, setLoading] = useState(false);

  const [newLastName, setNewLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newBirthdate, setNewBirthdate] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [currentView, setCurrentView] = useState(1);

  const router = useRouter();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    setLoading(true);

    const newRecord = {
      last_name: newLastName,
      first_name: newFirstName,
      // gender: newGender,
      //   birth_date: "",
      //   address: "",
      //   phone_number: "",
      email: newEmail,
      password: newPassword,
      role: "passenger",
    };

    try {
      await createNewUser(newEmail, newPassword, newRecord);

      router.push("/");

      setNewLastName("");
      setNewFirstName("");
      // setNewGender("");
      //   setNewBirthdate("");
      //   setNewAddress("");
      //   setNewPhoneNumber("");
      setNewEmail("");
      setNewPassword("");

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`error: ${error}`);
      //   alert(
      //     "Failed to create user: A user with this email address has already been registered."
      //   );
    }
  };

  return (
    <>
      <div className="min-h-[100svh] h-[100svh] flex flex-col  bg-sky-100">
        {loading && <LoadingScreenSection />}
        <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 container mx-auto">
          <div className="max-w-md w-full space-y-8 ">
            <div className="flex flex-col items-center mt-[-5rem]">
              <button onClick={() => router.push("/")}>
                <h1 className="mt-2 text-center text-2xl font-extrabold text-sky-700">
                  Traffico
                </h1>
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">Sign-up</p>
            </div>
            <div className="mt-5 space-y-6">
              <input type="hidden" name="remember" value="true" />
              <div className="flex flex-col rounded-md shadow-sm gap-3">
                <div>
                  <label htmlFor="newFirstName" className="sr-only">
                    First Name
                  </label>
                  <input
                    id="newFirstName"
                    name="newFirstName"
                    type="newFirstName"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-sky-50"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label htmlFor="newLastName" className="sr-only">
                    Last Name
                  </label>
                  <input
                    id="newLastName"
                    name="newLastName"
                    type="newLastName"
                    required
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-sky-50"
                    placeholder="Last Name"
                  />
                </div>
                {/* <div>
                  <label htmlFor="newGender" className="sr-only"></label>
                  <select
                    name="newGender"
                    id="newGender"
                    required
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-sky-50">
                    <option value=""> Select...</option>
                    <option value="single">Male</option>
                    <option value="married">Female</option>
                    <option value="married">Others</option>
                  </select>
                </div> */}
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="newEmail"
                    type="newEmail"
                    autoComplete="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-sky-50"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="newPassword"
                    autoComplete="current-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 placeholder-gray-500 text-gray-900 rounded-md  sm:text-sm bg-sky-50"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={
                    !newLastName ||
                    !newFirstName ||
                    !newEmail ||
                    !newPassword ||
                    !emailRegex.test(newEmail)
                  }
                  className={`${
                    !newLastName ||
                    !newFirstName ||
                    !newEmail ||
                    !newPassword ||
                    !emailRegex.test(newEmail)
                      ? "bg-gray-700"
                      : "bg-sky-700"
                  } group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-lg text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700`}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPassenger;

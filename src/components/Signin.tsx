"use client";

import { supabase } from "@/utils/supabase";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingScreenSection } from "./LoadingScreen";

const SigninComponent = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userType = pathname.includes("/admin/")
    ? "admin"
    : pathname.includes("/passenger/")
    ? "passenger"
    : null;

  //roles: admin, personnel, enforcer, passenger
  const [role, setRole] = useState("admin");

  useEffect(() => {
    if (userType === "passenger") {
      setRole("passenger");
    } else {
      setRole("admin");
    }
  }, [userType]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // console.log("role", role);

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setLoading(false);
        alert(`Login failed: ${error.message}`);
      } else {
        if (role === "personnel") {
          const user = data?.user;
          const { data: userData, error: fetchError } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "personnel");

          if (fetchError || userData.length === 0) {
            setLoading(false);
            await supabase.auth.signOut();
            alert("You are not a personnel!");
            return;
          }
          setLoading(true);
          router.push("/personnel/dashboard/dashboard");
        } else if (role === "enforcer") {
          const user = data?.user;
          const { data: userData, error: fetchError } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "enforcer");

          if (fetchError || userData.length === 0) {
            setLoading(false);
            await supabase.auth.signOut();
            alert("You are not a traffic enforcer!");
            return;
          }
          setLoading(true);
          router.push("/enforcer/dashboard/");
        } else if (role === "passenger") {
          const user = data?.user;
          const { data: userData, error: fetchError } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "passenger");

          if (fetchError || userData.length === 0) {
            setLoading(false);
            await supabase.auth.signOut();
            alert("You are not a passenger!");
            return;
          }
          setLoading(true);
          router.push("/passenger/dashboard/");
        } else if (role === "admin") {
          const user = data?.user;

          const { data: userData1, error: fetchError1 } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "personnel");

          const { data: userData2, error: fetchError2 } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "enforcer");

          const { data: userData3, error: fetchError3 } = await supabase
            .from("UserLists")
            .select("id")
            .eq("id", user?.id)
            .eq("role", "passenger");

          if (
            (fetchError1 || userData1?.length === 0) &&
            (fetchError2 || userData2?.length === 0) &&
            (fetchError3 || userData3?.length === 0)
          ) {
            // If user is not present in both personnel_profiles and enforcer_profiles and passenger_profiles
            setLoading(true);
            router.push("/admin/dashboard/dashboard");
            return;
          }
          setLoading(false);
          alert("You are not an admin!");
          await supabase.auth.signOut();
        }
      }
      // setLoading(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <>
      <div className="min-h-[100svh] h-[100svh] flex flex-col  bg-sky-100">
        {loading && <LoadingScreenSection />}
        <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 container mx-auto">
          <div className="max-w-md w-full space-y-8 ">
            <div className="flex flex-col items-center mt-[-5rem]">
              {/* <button onClick={() => router.push("/")}>
                <Image
                  src="/traffico-logo.jpeg"
                  alt="Traffico Logo"
                  width={80}
                  height={80}
                />
              </button>
              <h1 className="mt-6 text-center text-2xl font-bold text-gray-900">
                Sign in
              </h1> */}
              <button onClick={() => router.push("/")}>
                <h1 className="mt-2 text-center text-2xl font-extrabold text-sky-700">
                  Traffico
                </h1>
              </button>
              <p className="mt-2 text-center text-sm text-gray-600">Sign in</p>
            </div>
            <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="flex flex-col rounded-md shadow-sm gap-3">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 sm:text-sm bg-sky-50"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full p-3 border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 placeholder-gray-500 text-gray-900 rounded-md  sm:text-sm bg-sky-50"
                    placeholder="Password"
                  />
                </div>
                {userType === "admin" && (
                  <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="self-end border border-sky-700 focus:outline-none focus:ring-sky-700 focus:border-sky-700 focus:z-10 rounded-lg p-1 px-2 text-sm bg-sky-50">
                    <option value="admin">Administrator</option>
                    <option value="personnel">Personnel</option>
                    <option value="enforcer">Traffic Enforcer</option>
                    {/* <option value="passenger">Passenger</option> */}
                  </select>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center p-3 border border-transparent text-sm font-medium rounded-lg text-white bg-sky-700 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-700">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SigninComponent;

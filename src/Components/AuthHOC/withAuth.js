"use client";
import { useRouter } from "next/navigation";
import { useEffect, useContext } from "react";
import Cookies from "js-cookie";
import AuthContext from "@/Helper/AuthContext/AuthContext";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const { isAuthenticated } = useContext(AuthContext);
    const isAuthString = Cookies.get("uatTemp");
    const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

    useEffect(() => {
      if (!isAuth) {
        router.replace("/admin");
      }
    }, [isAuth]);

    if (!isAuth) {
      return null; // Or a loading spinner, etc.
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;

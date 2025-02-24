import { useEffect, useContext } from "react";
import Cookies from "js-cookie";
import I18NextContext from "@/Helper/I18NextContext";
import { useRouter } from "next/navigation";

const AuthChecker = ({ children }) => {
  const { i18Lang } = useContext(I18NextContext);
  const router = useRouter();

  useEffect(() => {
    const isUserAuthenticated = Cookies.get("uat");

    if (!isUserAuthenticated && i18Lang) {
      // Redirect to the login page if the user is not authenticated
      router.push(`/${i18Lang}/auth/login`);
    }
  }, [i18Lang]);

  return children;
};

const withAuth = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <AuthChecker>
      <WrappedComponent {...props} />
    </AuthChecker>
  );
};

export default withAuth;

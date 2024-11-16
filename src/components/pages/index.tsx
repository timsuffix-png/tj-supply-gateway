import AuthProvider, { useAuth } from "../auth/authProvider";
import { useEffect } from "react";
import Routing from "./routing";

export default function Index() {
  const auth = useAuth();
  useEffect(() => {}, [auth]);

  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

import AuthProvider from "../auth/authProvider";
import Routing from "./routing";

export default function Index() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

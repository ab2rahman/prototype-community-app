import { useEffect, useState } from "react";
import { auth } from "./mocks/firebase";
import { getMockUserData } from "./mocks/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userData = getMockUserData();
        if (userData) {
          setUserRole(userData.role);
          setMustChangePassword(!!userData.mustChangePassword);
        } else {
          setUserRole(null);
          setMustChangePassword(false);
        }
      } else {
        setUserRole(null);
        setMustChangePassword(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, userRole, mustChangePassword, loading };
}

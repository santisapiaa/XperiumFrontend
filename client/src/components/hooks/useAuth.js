import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectUserData,
  selectIsAuthenticated,
  selectAuthLoading,
  logout,
} from "../redux/authSlice";

/**
 * Hook personalizado que proporciona acceso a todo lo relacionado con autenticación
 *
 * Uso:
 * const { user, userData, isAuthenticated, loading, logout } = useAuth()
 *
 * @returns {Object} Objeto con user, userData, isAuthenticated, loading, logout, token, role
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  return {
    user,
    userData,
    isAuthenticated,
    loading,
    token: user?.access_token || null,
    role: user?.rol || null,
    logout: () => dispatch(logout()),
  };
};

export default useAuth;

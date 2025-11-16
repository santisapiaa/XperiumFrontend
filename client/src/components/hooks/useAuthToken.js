import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticated } from "../redux/authSlice";

/**
 * Hook personalizado para obtener el token de autenticación desde Redux
 * Funciona para AMBOS tipos de usuarios: COMPRADOR y PROVEEDOR
 *
 * Uso:
 * const { token, isAuthenticated } = useAuthToken()
 *
 * @returns {Object} { token, isAuthenticated }
 */
export const useAuthToken = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return {
    token: user?.access_token || null,
    isAuthenticated,
    user,
  };
};

export default useAuthToken;

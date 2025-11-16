import { useSelector } from "react-redux";
import { selectUser } from "../redux/authSlice";

/**
 * Hook para obtener el rol del usuario actual
 *
 * @returns {'COMPRADOR'|'PROVEEDOR'|null} El rol del usuario o null
 */
export const useUserRole = () => {
  const user = useSelector(selectUser);
  return user?.rol || null;
};

/**
 * Hook para verificar si el usuario es COMPRADOR
 *
 * @returns {boolean}
 */
export const useIsComprador = () => {
  const role = useUserRole();
  return role === "COMPRADOR";
};

/**
 * Hook para verificar si el usuario es PROVEEDOR
 *
 * @returns {boolean}
 */
export const useIsProveedor = () => {
  const role = useUserRole();
  return role === "PROVEEDOR";
};

export default useUserRole;

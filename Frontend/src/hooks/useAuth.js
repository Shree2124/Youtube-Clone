import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const loading = useSelector((state) => state.auth?.loading);

  useLayoutEffect(() => {
    if (!user) dispatch(fetchUser());
  }, []);

  return { user, loading };
};

export default useAuth;

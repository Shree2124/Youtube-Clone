import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const loading = useSelector((state) => state.auth?.loading);

  useLayoutEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  console.log(user);


  // useEffect(() => {
  //   if (!loading && !user) {
  //     navigate('/login');
  //   }
  // }, [loading, user, navigate]);

  return { user, loading };
};

export default useAuth;

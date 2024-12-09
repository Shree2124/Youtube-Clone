import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/slices/userSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const loading = useSelector((state) => state?.auth?.loading);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!user && !hasFetched) {
      dispatch(fetchUser());
      setHasFetched(true);
    }
  }, [dispatch, user, hasFetched]);

  const authState = useMemo(() => ({ user, loading }), [user, loading]);

  return authState;
};

export default useAuth;

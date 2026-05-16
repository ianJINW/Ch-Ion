import { useEffect } from 'react';
import axios from 'axios';
import { useAuthApi } from '../lib/auth-api';
import useAuthStore from '../store/auth.store';

const useAuthSync = () => {
  const { data, isError, isSuccess, error } = useAuthApi();

  const setAuth = useAuthStore((s) => s.login);
  const logoutUser = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isSuccess && data) {
      setAuth(data.user, data.token ?? null);
    }

    if (isError) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          logoutUser();
        }
      }
    }
  }, [data, error, isError, isSuccess, setAuth, logoutUser]);
}

export default useAuthSync
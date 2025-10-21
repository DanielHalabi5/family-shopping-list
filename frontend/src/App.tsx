
import { useState, type FormEvent } from 'react';
import AuthPage from './components/AuthPage'
import useAuthStore from './stores/authStore';
import { createFamily, login, signup } from './api';
import type { User } from './types';
import { HomePage } from './components/HomePage';
import useFamilyStore from './stores/familyStore';



const App = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const { families, fetchFamilies, addFamily } = useFamilyStore();



  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleLogin(e: FormEvent<HTMLFormElement>, creds: User) {

    e.preventDefault();
    try {
      const res = await login(creds);
      setSuccessMsg('');
      setAuth(res.token, res.user);
      setSuccessMsg("Your Account was logged in Successfully!")
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err: unkown) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      } else {
        setErrorMsg('Something went wrong.');
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      }
    }
  }

  async function handleSignup(e: FormEvent<HTMLFormElement>, creds: User) {

    e.preventDefault();
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const res = await signup(creds);
      setAuth(res.token, res.user);
      setSuccessMsg("Your Account was created Successfully!")
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err: unkown) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      } else {
        setErrorMsg('Something went wrong.');
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      }
    }
  }

  async function handleFamilyCreate(familyData: { familyName: string }) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const n = await createFamily(token, { ...familyData, userId: user.id });
      addFamily(n.family);
      user.familyId = n.family.id;
      setAuth(token, user);
      setSuccessMsg("The Family Group was Created Successfully!")
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err: unkown) {
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      } else {
        setErrorMsg('Something went wrong.');
        setTimeout(() => {
          setErrorMsg('');
        }, 5000);
      }
    }
  }




  if (!token) {
    <AuthPage
      handleLogin={handleLogin}
      handleSignup={handleSignup}
    />
  }

  return (
    //  main app component when logged in
    <HomePage handleFamilyCreate={handleFamilyCreate} />
  )
}

export default App
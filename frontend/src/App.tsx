
import { useEffect, useState, type FormEvent } from 'react';
import AuthPage from './components/AuthPage'
import useAuthStore from './stores/authStore';
import { createFamily, login, signup } from './api';
import type { User } from './types';
import { HomePage } from './components/HomePage';
import useFamilyStore from './stores/familyStore';
import useJoinRequestStore from './stores/joinRequestStore';
import { BiLogOutCircle } from 'react-icons/bi';
import useListStore from './stores/ListStore';



const App = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const { families, fetchFamilies, addFamily } = useFamilyStore();
  const { requests, sendJoinRequest } = useJoinRequestStore();
  const { currentList, lists, fetchLists, fetchCurrentList } = useListStore();



  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  useEffect(() => {
    if (token) {
      fetchFamilies(token);
    }
  }, [token, fetchFamilies]);


  async function handleLogin(creds: User) {
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

  async function handleSignup(creds: User) {

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

  async function handleFamilyCreate(familyData: { name: string }) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const n = await createFamily(token, { ...familyData, userId: user.id });
      addFamily(n.family);
      const updatedUser = { ...user, familyId: n.family.id };
      setAuth(token, updatedUser);
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

  async function handleJoin(familyId: string) {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      await sendJoinRequest(token, user.id, familyId);
      setSuccessMsg("The Join Request Was Successfully Sent")
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      setErrorMsg('Request Was Already Sent');
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  };

  async function getLists() {
    try {
      await fetchLists(token);
      setErrorMsg('');
      setSuccessMsg("Lists Fetched Successfully!")
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      console.error("Failed to fetch lists", err);
      setErrorMsg('Failed to fetch lists');
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

  async function getCurrentList() {
    try {
      await fetchCurrentList(token);
      setErrorMsg('');
      setSuccessMsg("Current List Fetched Successfully!")
    } catch (err) {
      console.error("Failed to fetch current list", err);
      setErrorMsg('Failed to fetch current list');
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

  if (!token) {
    return <AuthPage
      handleLogin={handleLogin}
      handleSignup={handleSignup}
    />
  }

  if (user.familyId === null || user.familyId === undefined) {
    return <HomePage user={user} handleFamilyCreate={handleFamilyCreate} handleJoin={handleJoin} clearAuth={clearAuth} />
  } else {
    return (
      <>
        <Dashboard user={user} getLists={getLists} lists={lists} currentList={currentList} getCurrentList={getCurrentList} />
      </>
    )
  }
}

export default App
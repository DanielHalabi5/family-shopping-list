import { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import useAuthStore from './stores/authStore';
import { createFamily, login, signup } from './api';
import { HomePage } from './components/HomePage';
import useFamilyStore from './stores/familyStore';
import useJoinRequestStore from './stores/joinRequestStore';
import useListStore from './stores/ListStore';
import Dashboard from './components/Dashboard';
import useItemsStore from './stores/shoppingItemsStore';
import { Header } from './components/Header';

const App = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const { families, fetchFamilies, addFamily } = useFamilyStore();
  const { sendJoinRequest } = useJoinRequestStore();
  const { currentList, fetchLists, fetchCurrentList } = useListStore();
  const { createItem, updateItem, deleteItem } = useItemsStore();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState<'auth' | 'home' | 'dashboard' | 'join-requests' | 'previous-lists'>('auth');

  useEffect(() => {
    if (token) {
      fetchFamilies(token);
      if (user?.familyId) {
        fetchCurrentList(token);
      }
    }
  }, [token, user?.familyId, fetchFamilies, fetchCurrentList]);

  async function handleLogin(creds: { email: string; password: string }) {
    try {
      const res = await login(creds);
      setErrorMsg('');
      setAuth(res.token, res.user);
      setSuccessMsg("Your Account was logged in Successfully!");
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Something went wrong.');
      }
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

  async function handleSignup(creds: { email: string; password: string; name: string }) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const res = await signup(creds);
      setAuth(res.token, res.user);
      setSuccessMsg("Your Account was created Successfully!");
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg('Something went wrong.');
      }
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

async function handleFamilyCreate(familyData: { name: string }) {
  try {
    setErrorMsg('');
    setSuccessMsg('');
    const response = await createFamily(token!, { ...familyData, userId: user!.id });

    addFamily(response.family);

    if (response.token && response.user) {
      setAuth(response.token, response.user);
    } else {
      const updatedUser = { ...user!, familyId: response.family.id };
      setAuth(token!, updatedUser);
    }
    setSuccessMsg("The Family Group was Created Successfully!");
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  } catch (err: any) {
    if (err.response?.data?.error) {
      setErrorMsg(err.response.data.error);
    } else {
      setErrorMsg('Something went wrong.');
    }
    setTimeout(() => {
      setErrorMsg('');
    }, 5000);
  }
}

  async function handleJoin(familyId: string) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await sendJoinRequest(token!, user!.id, familyId);
      setSuccessMsg("The Join Request Was Successfully Sent");
      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    } catch (err) {
      setErrorMsg('Request Was Already Sent');
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

  async function getLists() {
    try {
      await fetchLists(token!);
      setErrorMsg('');
      setSuccessMsg("Lists Fetched Successfully!");
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
      await fetchCurrentList(token!);
      setErrorMsg('');
    } catch (err) {
      console.error("Failed to fetch current list", err);
      setErrorMsg('Failed to fetch current list');
      setTimeout(() => {
        setErrorMsg('');
      }, 5000);
    }
  }

  async function handleCreate(taskData: { name: string; quantity: string; listId: string }) {
    try {
      await createItem(token!, taskData);
      await getCurrentList();
    } catch (err) {
      console.error("Failed to create item", err);
      setErrorMsg('Failed to create item');
    }
  }

  async function handleUpdate(id: string, data: { purchased?: boolean; status?: string }) {
    try {
      await updateItem(token!, id, data);
      await getCurrentList();
    } catch (err) {
      console.error("Failed to update item", err);
      setErrorMsg('Failed to update item');
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteItem(token!, id);
      await getCurrentList();
    } catch (err) {
      console.error("Failed to delete item", err);
      setErrorMsg('Failed to delete item');
    }
  }

  if (!token || !user) {
    return (
      <>
        {errorMsg && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {successMsg}
          </div>
        )}
        <AuthPage handleLogin={handleLogin} handleSignup={handleSignup} />
      </>
    );
  }

  const userFamily = user.familyId
    ? families.find(fam => fam.id === user.familyId)
    : null;

  const isAdmin = userFamily ? userFamily.ownerId === user.id : false;
  console.log('🔍 Admin Check:', {
    'User ID': user.id,
    'User Family ID': user.familyId,
    'Total Families': families.length,
    'User Family Found': !!userFamily,
    'Owner ID': userFamily?.ownerId,
    'Is Admin': isAdmin
  });

  if (!user.familyId) {
    return (
      <>
        {errorMsg && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            {successMsg}
          </div>
        )}
        <HomePage
          user={user}
          handleFamilyCreate={handleFamilyCreate}
          handleJoin={handleJoin}
          clearAuth={clearAuth}
        />
      </>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {successMsg}
        </div>
      )}
      <Header
        user={user}
        isAdmin={!!isAdmin}
        clearAuth={clearAuth}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Dashboard
        user={user}
        families={families}
        currentList={currentList}
        handleCreate={handleCreate}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        getCurrentList={getCurrentList}
      />
    </>
  );
};

export default App;
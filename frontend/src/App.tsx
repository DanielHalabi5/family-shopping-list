import { useEffect, useState } from 'react';
import AuthPage from './components/AuthPage';
import useAuthStore from './stores/authStore';
import { approveJoinRequest, createFamily, login, rejectJoinRequest, signup } from './api';
import { HomePage } from './components/HomePage';
import useFamilyStore from './stores/familyStore';
import useJoinRequestStore from './stores/joinRequestStore';
import useListStore from './stores/ListStore';
import useItemsStore from './stores/shoppingItemsStore';
import { Header } from './components/Header';
import { JoinRequests } from './components/JoinRquests';
import { PreviousLists } from './components/PreviousLists';
import Dashboard from './components/DashBoard';

const App = () => {
  const { token, user, setAuth, clearAuth } = useAuthStore();
  const { families, fetchFamilies, addFamily } = useFamilyStore();
  const { requests, fetchRequests, sendJoinRequest } = useJoinRequestStore();
  const { currentList, fetchCurrentList, fetchLists, lists } = useListStore();
  const { createItem, updateItem, deleteItem } = useItemsStore();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'join-requests' | 'previous-lists'>('dashboard');

  useEffect(() => {
    if (token) {
      fetchFamilies(token);
      if (user?.familyId) {
        fetchCurrentList(token);
      }
      fetchRequests(token);
    }
  }, [token, user?.familyId, fetchFamilies, fetchCurrentList, fetchRequests]);

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
    } catch (err: any) {
      if (err?.response?.data?.error?.includes('already') || err?.response?.status === 409) {
        setErrorMsg('You have already sent a join request to this family');
      } else {
        setErrorMsg('Failed to send join request');
      }
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
      await createItem(token!, { ...taskData, purchased: false });
      await getCurrentList();
    } catch (err) {
      console.error("Failed to create item", err);
      setErrorMsg('Failed to create item');
    }
  }

  async function handleUpdate(id: string, data: { purchased?: boolean }) {
    try {
      const status = data.purchased ? 'PURCHASED' : 'SKIPPED';
      await updateItem(token!, id, { status, purchased: data.purchased });
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


  async function handleApproveRequest(requestId: string) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await approveJoinRequest(token!, requestId);
      await fetchRequests(token!);
      setSuccessMsg("Request approved successfully!");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg("Failed to approve request");
      setTimeout(() => setErrorMsg(''), 5000);
    }
  }

  async function handleRejectRequest(requestId: string) {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      await rejectJoinRequest(token!, requestId);
      await fetchRequests(token!);
      setSuccessMsg("Request rejected successfully!");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg("Failed to reject request");
      setTimeout(() => setErrorMsg(''), 5000);
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
      <Header

        user={user}
        isAdmin={!!isAdmin}
        clearAuth={clearAuth}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex items-center justify-center mb-6 px-4 sm:px-6 lg:px-8 space-y-2">
        {errorMsg && (
          <div className=" bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className=" bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg">
            {successMsg}
          </div>
        )}
      </div>

      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          families={families}
          currentList={currentList}
          handleCreate={handleCreate}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          errorMsg={errorMsg}
          successMsg={successMsg}
        />
      )}

      {currentPage === 'join-requests' && isAdmin && (
        <JoinRequests
          requests={requests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
        />
      )}

      {currentPage === 'previous-lists' && userFamily && (
        <PreviousLists familyId={userFamily.id} token={token} fetchLists={fetchLists} lists={lists} />
      )}

    </>
  );
};

export default App;
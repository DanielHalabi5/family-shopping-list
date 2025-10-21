import { useState } from 'react';
import { FaPlus, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import type {  User } from '../types';


type HomePageProps = {
  user: User;

};

export function HomePage({ user }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [familyName, setFamilyName] = useState('');
  const [familyCode, setFamilyCode] = useState('');

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <FaUserFriends className="w-8 h-8" />
          </div>
          <h2 className="mb-2">Welcome, {user.name}!</h2>
          <p className="text-gray-600">Create a new family or join an existing one</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="mb-1">Get Started</h2>
            <p className="text-gray-600">Choose an option below to begin managing your family shopping list</p>
          </div>
          
          <div className="p-6">
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'create'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaPlus className="w-4 h-4" />
                Create Family
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-2 px-4 rounded-md transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'join'
                    ? 'bg-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FaUserPlus className="w-4 h-4" />
                Join Family
              </button>
            </div>
            
            {activeTab === 'create' && (
              <div className="space-y-4">
                <form 

                className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="family-name" className="block">
                      Family Name
                    </label>
                    <input
                      id="family-name"
                      type="text"
                      placeholder="The Smiths"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500">
                      Choose a name for your family group
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaPlus className="w-4 h-4" />
                    Create Family
                  </button>
                </form>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    As the creator, you'll be the admin and can approve join requests from other family members.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'join' && (
              <div className="space-y-4">
                <form 

                className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="family-code" className="block">
                      Family Code
                    </label>
                    <input
                      id="family-code"
                      type="text"
                      placeholder="Enter family code"
                      value={familyCode}
                      onChange={(e) => setFamilyCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500">
                      Ask your family admin for the family code
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Request to Join
                  </button>
                </form>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    Your request will be sent to the family admin for approval.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

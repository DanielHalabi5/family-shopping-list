import { useState, useEffect } from 'react';
import { FaHistory, FaCalendar, FaShoppingCart, FaCheck, FaChevronDown } from 'react-icons/fa';
import type { List, ShoppingItem } from '../types';

type PreviousListsProps = {
  token: string;
  familyId: string;
  fetchLists: (token: string) => Promise<void>;
  lists: List[];
};

export function PreviousLists({ token, familyId, fetchLists, lists }: PreviousListsProps) {
  const [archivedLists, setArchivedLists] = useState<List[]>([]);
  const [expandedList, setExpandedList] = useState<string | null>(null);

  useEffect(() => {
    fetchArchivedLists();
  }, [familyId, token, lists]);

  const fetchArchivedLists = async () => {
    await fetchLists(token);
    const data = lists.filter((list) => list.familyId === familyId && list.archived);
    if (data.length > 0) {
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setArchivedLists(sorted);
    } else {
      setArchivedLists([]);
    }
  };

  const toggleList = (listId: string) => {
    setExpandedList(expandedList === listId ? null : listId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getWeekLabel = (createdAt: string) => {
    const date = new Date(createdAt);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return `${formatDate(weekStart.toISOString())} - ${formatDate(weekEnd.toISOString())}`;
  };

  const isItemPurchased = (item: ShoppingItem) => {
    return item.status === 'PURCHASED' || item.purchased === true;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaHistory className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="mb-1">Previous Lists</h2>
              <p className="text-gray-600">View your family's shopping history</p>
            </div>
          </div>
        </div>

        {archivedLists.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="mb-1">Shopping History</h3>
              <p className="text-gray-600">
                {archivedLists.length} {archivedLists.length === 1 ? 'list' : 'lists'} archived
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {archivedLists.map((list, index) => {
                  const completedItems = list.items?.filter((item: ShoppingItem) => isItemPurchased(item)) || [];
                  const totalItems = list.items?.length || 0;
                  const completionRate = totalItems > 0
                    ? Math.round((completedItems.length / totalItems) * 100)
                    : 0;
                  const isExpanded = expandedList === list.id;

                  return (
                    <div key={list.id} className="border border-gray-200 rounded-lg bg-white">
                      <button
                        onClick={() => toggleList(list.id)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FaCalendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">List #{archivedLists.length - index}</p>
                            <p className="text-sm text-gray-500">
                              {getWeekLabel(list.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-200 bg-gray-50">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'}
                          </span>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${completionRate === 100
                                ? 'bg-green-600 text-white'
                                : completionRate >= 50
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                          >
                            {completionRate}% Complete
                          </span>
                          <FaChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'transform rotate-180' : ''
                              }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                          <div className="pt-4 space-y-3">
                            {list.items && list.items.length > 0 ? (
                              <>
                                {list.items.map((item: ShoppingItem) => {
                                  const isPurchased = isItemPurchased(item);
                                  return (
                                    <div
                                      key={item.id}
                                      className={`flex items-center justify-between p-3 rounded-lg ${isPurchased
                                          ? 'bg-green-50 border border-green-200'
                                          : 'bg-gray-50 border border-gray-200'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        {isPurchased && (
                                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <FaCheck className="w-3 h-3 text-white" />
                                          </div>
                                        )}
                                        <div className={isPurchased ? 'opacity-75' : ''}>
                                          <p className={`font-medium ${isPurchased ? 'line-through' : ''}`}>
                                            {item.name}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${isPurchased
                                            ? 'border-green-300 bg-green-100 text-green-700'
                                            : 'border-gray-200 bg-white text-gray-700'
                                          }`}>
                                          {isPurchased ? 'Purchased' : 'Not purchased'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            ) : (
                              <p className="text-center text-gray-500 py-4">No items in this list</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No previous lists yet</h3>
              <p className="text-gray-500">
                Archived shopping lists will appear here once you complete them
              </p>
            </div>
          </div>
        )}

        {archivedLists.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Tip:</strong> Lists are automatically archived when you mark them as complete.
              You can view all past shopping activities to track your family's buying patterns.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { FaCopy, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import type { Family, List, ShoppingItem, User } from '../types';
import { useState } from 'react';

type Props = {
    user: User;
    families: Family[];
    currentList: List[];
    handleCreate: (taskData: { name: string; quantity: string; listId: string; }) => Promise<void>;
    handleUpdate: (id: string, data: { purchased?: boolean }) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    errorMsg: string;
    successMsg: string;
}

const Dashboard = ({ user, families, currentList, handleCreate, handleUpdate, handleDelete, errorMsg, successMsg }: Props) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Family code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName || !newItemQuantity) return;

        const currentListId = currentList[0]?.id || '';

        await handleCreate({
            name: newItemName,
            quantity: newItemQuantity,
            listId: currentListId
        });

        setNewItemName('');
        setNewItemQuantity('');
    };

    const handleTogglePurchased = async (item: ShoppingItem) => {
        const isPurchased = item.status === 'PURCHASED' || item.purchased === true;
        await handleUpdate(item.id, { purchased: !isPurchased });
    };

    const handleDeleteItem = async (id: string) => {
        await handleDelete(id);
    };

    const isItemPurchased = (item: ShoppingItem) => {
        return item.status === 'PURCHASED' || item.purchased === true;
    };

    const userFamily = families.find(fam => fam.id === user.familyId);

    const allItems = Array.isArray(currentList)
        ? currentList.flatMap(list => list.items || [])
        : [];

    const purchasedItems = allItems.filter(item => isItemPurchased(item));
    const unpurchasedItems = allItems.filter(item => !isItemPurchased(item));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="mb-2">Shopping List</h2>
                            <p className="text-gray-600">Manage your family's weekly shopping together</p>
                        </div>
                        {userFamily && (
                            <button
                                onClick={() => copyToClipboard(userFamily.id)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <FaCopy className="w-4 h-4" />
                                Copy Family Code
                            </button>
                        )}
                    </div>

                    {userFamily && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaUsers className="w-5 h-5 text-blue-600" />
                                        <span>Family Members</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {userFamily.members && Array.isArray(userFamily.members) ? (
                                            userFamily.members.map((member) => (
                                                <span
                                                    key={member.id}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-gray-200"
                                                >
                                                    {member.name || `Member ${member.id}`}
                                                    {member.id === userFamily.ownerId && ' (Admin)'}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-gray-600">No members found</span>
                                        )}
                                    </div>
                                </div>

                                {allItems.length > 0 && (
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 mb-1">Progress</div>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {purchasedItems.length}/{allItems.length}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="mb-1">Add Item</h3>
                                <p className="text-gray-600">Add a new item to your shopping list</p>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleAddItem} className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label htmlFor="item-name" className="block">
                                                Item Name
                                            </label>
                                            <input
                                                id="item-name"
                                                type="text"
                                                placeholder="e.g., Milk"
                                                value={newItemName}
                                                onChange={(e) => setNewItemName(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="item-quantity" className="block">
                                                Quantity
                                            </label>
                                            <input
                                                id="item-quantity"
                                                type="text"
                                                placeholder="e.g., 2 liters"
                                                value={newItemQuantity}
                                                onChange={(e) => setNewItemQuantity(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add to List
                                    </button>
                                </form>
                            </div>
                        </div>

                        {unpurchasedItems.length > 0 && (
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="mb-1">To Purchase ({unpurchasedItems.length})</h3>
                                    <p className="text-gray-600">Items that need to be purchased</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {unpurchasedItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={false}
                                                        onChange={() => handleTogglePurchased(item)}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">{item.quantity}</p>
                                                    </div>
                                                    {item.owner && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-200 bg-white">
                                                            {item.owner.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {purchasedItems.length > 0 && (
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="mb-1">Purchased ({purchasedItems.length})</h3>
                                    <p className="text-gray-600">Items already bought</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {purchasedItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={true}
                                                        onChange={() => handleTogglePurchased(item)}
                                                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                                    />
                                                    <div className="flex-1 opacity-75">
                                                        <p className="font-medium line-through">{item.name}</p>
                                                        <p className="text-sm text-gray-500 line-through">{item.quantity}</p>
                                                    </div>
                                                    {item.owner && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-green-300 bg-green-100 text-green-700">
                                                            {item.owner.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {allItems.length === 0 && (
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-12 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <FaPlus className="w-16 h-16 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No items yet</h3>
                                    <p className="text-gray-500">
                                        Start by adding items to your shopping list
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3>Tips</h3>
                            </div>
                            <div className="p-6 space-y-3 text-sm text-gray-600">
                                <p>• Share the family code with members to let them join</p>
                                <p>• Check off items as you shop</p>
                                <p>• Complete the week to archive and start fresh</p>
                                <p>• View previous lists in the History section</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
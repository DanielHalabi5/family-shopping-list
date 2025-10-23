import { FaCheck, FaCopy, FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import type { Family, List, ShoppingItem, User } from '../types';
import { useState } from 'react';

type Props = {
    user: User;
    families: Family[];
    currentList: List[];
    handleCreate: (taskData: { name: string; quantity: string; listId: string; }) => Promise<void>;
    handleUpdate: (id: string, data: { purchased?: boolean }) => Promise<void>;
    handleDelete: (id: string) => Promise<void>;
    getCurrentList: () => Promise<void>;
}

const Dashboard = ({ user, families, currentList, handleCreate, handleUpdate, handleDelete, getCurrentList }: Props) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard!');
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
        await getCurrentList();
    };

    const handleTogglePurchased = async (item: ShoppingItem) => {
        await handleUpdate(item.id, { purchased: !item.purchased });
    };

    const handleDeleteItem = async (id: string) => {
        await handleDelete(id);
        await getCurrentList();
    };

    const userFamily = families.find(fam => fam.id === user.familyId);

    const allItems = Array.isArray(currentList)
        ? currentList.flatMap(list => list.items || [])
        : [];

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
                                            userFamily.members.map((member: any) => (
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
                                    <button
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-white transition-colors flex items-center gap-2"
                                    >
                                        <FaCheck className="w-4 h-4" />
                                        Complete This Week
                                    </button>
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

                        {allItems.length > 0 && (
                            <div className="bg-white rounded-lg shadow border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="mb-1">Active Items ({allItems.length})</h3>
                                    <p className="text-gray-600">Items that need to be purchased</p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {allItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.purchased}
                                                        onChange={() => handleTogglePurchased(item)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <div className="flex-1">
                                                        <p className={item.purchased ? 'line-through text-gray-500' : ''}>{item.name}</p>
                                                        <p className="text-sm text-gray-500">{item.quantity}</p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-200 bg-white">
                                                        {user.name}
                                                    </span>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
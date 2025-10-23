import React from 'react'
import type { List, User } from '../types';

type Props = {
    user: User;
    getLists: (token: string) => Promise<void>;
    lists: List[];
    currentList: List[];
    getCurrentList: (token: string) => Promise<void>;
}

const Dashboard = ({ user, getLists, lists, currentList, getCurrentList, }: Props) => {
    return (
        <div>Dashboard</div>
    )
}

export default Dashboard
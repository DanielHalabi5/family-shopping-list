import { FaClock, FaUserCheck, FaUserSlash } from "react-icons/fa";
import type { JoinRequest } from "../types";

type JoinRequestsProps = {
    requests: JoinRequest[];
    onApprove: (requestId: string) => Promise<void>;
    onReject: (requestId: string) => Promise<void>;
};

export function JoinRequests({ requests = [], onApprove, onReject }: JoinRequestsProps) {

    async function handleAction(requestId: string, action: 'APPROVE' | 'REJECT') {
        try {
            if (action === 'APPROVE') await onApprove(requestId);
            else await onReject(requestId);
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="mb-2">Join Requests</h2>
                    <p className="text-gray-600">Manage requests from users who want to join your family</p>
                </div>

                {requests.length > 0 && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="flex items-center gap-2 mb-1">
                                <FaClock className="w-5 h-5 text-amber-500" />
                                Pending Requests ({requests.length})
                            </h3>
                            <p className="text-gray-600">Review and approve or reject these requests</p>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {requests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                                                <span>{request.user.name.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <div>
                                                <p>{request.user.name}</p>
                                                <p className="text-sm text-gray-500">wants to join your family</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAction(request.id, 'APPROVE')}
                                                className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                <FaUserCheck className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(request.id, 'REJECT')}
                                                className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                <FaUserSlash className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {requests.length === 0 && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 mb-6">
                        <div className="p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <FaClock className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="mb-2">No pending requests</h3>
                            <p className="text-gray-500">When users request to join your family, they'll appear here</p>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}

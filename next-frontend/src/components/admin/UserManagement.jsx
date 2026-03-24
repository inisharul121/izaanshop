'use client';

import React from 'react';
import { Users, ShieldCheck, Mail, Calendar, Check, X } from 'lucide-react';
import { format } from 'date-fns';

export const UserSection = ({ users }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="p-6 font-bold">User</th>
              <th className="p-6 font-bold">Email</th>
              <th className="p-6 font-bold">Role</th>
              <th className="p-6 font-bold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="font-bold text-dark">{user.name}</p>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-500">{user.email}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-sm text-gray-400">
                  {format(new Date(user.createdAt), 'dd MMM yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="py-20 text-center text-gray-400 italic">No customers found.</div>
      )}
    </div>
  );
};

export const AdminApprovalsSection = ({ pendingAdmins, onApprove }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <th className="p-6 font-bold">Admin Applicant</th>
              <th className="p-6 font-bold">Email</th>
              <th className="p-6 font-bold">Request Date</th>
              <th className="p-6 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pendingAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-6">
                   <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-dark">{admin.name}</p>
                  </div>
                </td>
                <td className="p-6 text-sm text-gray-500">{admin.email}</td>
                <td className="p-6 text-sm text-gray-400">
                  {format(new Date(admin.createdAt), 'dd MMM yyyy')}
                </td>
                <td className="p-6 text-right">
                  <button
                    onClick={() => onApprove(admin.id)}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 ml-auto"
                  >
                    <Check className="w-4 h-4" /> Approve Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingAdmins.length === 0 && (
        <div className="py-20 text-center text-gray-400 italic">No pending admin registrations.</div>
      )}
    </div>
  );
};

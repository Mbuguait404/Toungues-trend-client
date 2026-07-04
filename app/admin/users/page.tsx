'use client'

import { useState } from 'react'
import AdminTopBar from '@/components/admin-topbar'
import { Search, Filter, Download, Plus, Eye, Edit, Trash2 } from 'lucide-react'

const users = [
  { id: 1, avatar: 'AK', name: 'Amara Kipchoge', email: 'amara@example.com', role: 'Learner', course: 'French B1', status: 'Active', joined: 'Jan 15, 2025' },
  { id: 2, avatar: 'SL', name: 'Sophie Laurent', email: 'sophie@example.com', role: 'Teacher', course: 'French A1-C2', status: 'Active', joined: 'Jan 14, 2025' },
  { id: 3, avatar: 'MA', name: 'Mohammed Ahmed', email: 'mohammed@example.com', role: 'Learner', course: 'English A2', status: 'Active', joined: 'Jan 13, 2025' },
  { id: 4, avatar: 'EM', name: 'Elsa Mueller', email: 'elsa@example.com', role: 'Teacher', course: 'German A1-C2', status: 'Active', joined: 'Jan 12, 2025' },
  { id: 5, avatar: 'JK', name: 'James Kariuki', email: 'james@example.com', role: 'Learner', course: 'Kiswahili B2', status: 'Paused', joined: 'Jan 11, 2025' },
  { id: 6, avatar: 'LN', name: 'Lisa Neumann', email: 'lisa@example.com', role: 'Learner', course: 'German A1', status: 'Active', joined: 'Jan 10, 2025' },
  { id: 7, avatar: 'DK', name: 'David Kipkemboi', email: 'david@example.com', role: 'Teacher', course: 'Kiswahili A1-C2', status: 'Active', joined: 'Jan 9, 2025' },
  { id: 8, avatar: 'PR', name: 'Pierre Rousseau', email: 'pierre@example.com', role: 'Admin', course: 'All', status: 'Active', joined: 'Jan 8, 2025' },
  { id: 9, avatar: 'ZA', name: 'Zainab Ahmed', email: 'zainab@example.com', role: 'Learner', course: 'English C1', status: 'Active', joined: 'Jan 7, 2025' },
  { id: 10, avatar: 'HM', name: 'Hans Mueller', email: 'hans@example.com', role: 'Teacher', course: 'English A1-C2', status: 'Deactivated', joined: 'Jan 6, 2025' },
]

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Learners', value: 'learner' },
  { label: 'Teachers', value: 'teacher' },
  { label: 'Admins', value: 'admin' },
]

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'all' || user.role.toLowerCase() === activeTab
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  const toggleUser = (id: number) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id))
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Learner': return 'bg-blue-100 text-blue-700'
      case 'Teacher': return 'bg-gold bg-opacity-20 text-gold'
      case 'Admin': return 'bg-navy bg-opacity-10 text-navy'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700'
      case 'Paused': return 'bg-amber-100 text-amber-700'
      case 'Deactivated': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminTopBar title="User Management" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header with Add User Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Poppins' }}>
              Showing {filteredUsers.length} of {users.length} users
            </h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-full transition-all duration-150"
            >
              <Plus size={20} />
              Add User
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-100 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.value
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-gray-mid hover:text-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-3.5 text-gray-mid" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} className="text-gray-mid" />
              <span className="text-sm font-semibold text-navy">Filters</span>
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={18} className="text-gray-mid" />
              <span className="text-sm font-semibold text-navy">Export CSV</span>
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-light border-b border-gray-100">
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleAllUsers}
                        className="rounded border-gray-300 text-gold focus:ring-gold"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Joined</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-light'}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUser(user.id)}
                          className="rounded border-gray-300 text-gold focus:ring-gold"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center text-sm font-bold">
                            {user.avatar}
                          </div>
                          <span className="text-sm font-semibold text-navy">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{user.course}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-dark">{user.joined}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <Eye size={16} className="text-gray-mid" />
                          </button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                            <Edit size={16} className="text-gray-mid" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-mid">
              Showing <span className="font-semibold">{filteredUsers.length}</span> users
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-100 rounded-lg hover:bg-gray-50 text-sm font-semibold">Previous</button>
              <button className="px-4 py-2 bg-gold text-navy rounded-lg text-sm font-semibold">1</button>
              <button className="px-4 py-2 border border-gray-100 rounded-lg hover:bg-gray-50 text-sm font-semibold">2</button>
              <button className="px-4 py-2 border border-gray-100 rounded-lg hover:bg-gray-50 text-sm font-semibold">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-navy mb-6" style={{ fontFamily: 'Poppins' }}>
              Add New User
            </h2>
            <div className="space-y-4 mb-6">
              <input type="text" placeholder="Full Name" className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
              <input type="email" placeholder="Email" className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
              <input type="password" placeholder="Password" className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold" />
              <select className="w-full border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold">
                <option>Select Role</option>
                <option>Learner</option>
                <option>Teacher</option>
                <option>Admin</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-100 rounded-full py-3 font-semibold text-navy hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 bg-gold hover:bg-gold-light text-navy rounded-full py-3 font-semibold transition-colors">
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

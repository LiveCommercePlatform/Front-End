"use client"
import { useState } from 'react';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('home');
  const userName = "محمد علی";
  const profileImage = "https://randomuser.me/api/portraits/men/50.jpg"; 

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex items-center space-x-4 mb-8">
        <img
          src={profileImage}
          alt="Profile"
          className="w-16 h-16 rounded-full border-4 border-emerald-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{userName}</h2>
          <p className="text-sm text-gray-500">خوش آمدید به داشبورد</p>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="flex justify-around items-center bg-white py-2 px-4 rounded-full shadow-lg">
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out ${selectedTab === 'home' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
            onClick={() => setSelectedTab('home')}
          >
            صفحه اصلی
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out ${selectedTab === 'analytics' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
            onClick={() => setSelectedTab('analytics')}
          >
            تحلیل‌ها
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out ${selectedTab === 'users' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
            onClick={() => setSelectedTab('users')}
          >
            مدیریت کاربران
          </button>
          <button
            className={`px-6 py-2 text-lg font-semibold transition-all duration-300 ease-in-out ${selectedTab === 'settings' ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
            onClick={() => setSelectedTab('settings')}
          >
            تنظیمات
          </button>
        </div>

        <div
  className={`absolute bottom-0 h-1 bg-emerald-600 transition-all duration-300 ease-in-out`}
  style={{
    left:
      selectedTab === 'home'
        ? 'calc(86.25%)'
        : selectedTab === 'analytics'
        ? 'calc(62.5%)'
        : selectedTab === 'users'
        ? 'calc(37.5%)'
        : 'calc(13.75%)',
    width: '25%',
    transform: 'translateX(-50%)',
    borderRadius: '9999px',
  }}
></div>

      </div>

      <div>
        {selectedTab === 'home' && <div>صفحه اصلی</div>}
        {selectedTab === 'analytics' && <div>تحلیل‌ها</div>}
        {selectedTab === 'users' && <div>مدیریت کاربران</div>}
        {selectedTab === 'settings' && <div>تنظیمات</div>}
      </div>
    </div>
  );
}

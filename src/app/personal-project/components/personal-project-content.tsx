"use client";

import { Sidebar } from "../../../components/layout/sidebar";
import { Header } from "../../../components/layout/header";

import { IoOpenOutline } from "react-icons/io5";
import { GoTrash } from "react-icons/go";
import { MdNoteAdd } from "react-icons/md";
import { GoArrowSwitch } from "react-icons/go";
import { CiSearch } from "react-icons/ci";


  

const projectsData = [
  { name: "CMS CMLABS", lastUpdate: "03 Minute ago" },
  { name: "CMS Pegadaian", lastUpdate: "20 Hours ago" },
  { name: "CMS Polinema", lastUpdate: "21 Mar 2025, 10:00" },
];

const ActionButtons = () => (
  <div className="flex items-center space-x-2">
    <button
      title="Delete"
      className="p-2 rounded-full bg-red-100 text-red-500 hover:bg-red-200
                 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 transition-colors">
      <GoTrash size={16} />
    </button>

    {/* Tombol Edit */}
    <button
      title="Open"
      className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200
                 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors">
      <IoOpenOutline size={16} />
    </button>

    {/* Tombol Buka Tautan */}
    <button
      title="Add"
      className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200
                 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors">
      <MdNoteAdd size={16} />
    </button>

    {/* Tombol Bandingkan/Switch */}
    <button
      title="Switch"
      className="p-2 rounded-full bg-purple-100 text-purple-500 hover:bg-purple-200
                 dark:bg-purple-900/50 dark:text-purple-400 dark:hover:bg-purple-900 transition-colors">
      <GoArrowSwitch size={16} />
    </button>
  </div>
);

export default function PersonalProjectPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-8">
              Projects
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="relative w-full max-w-md">
                <CiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-slate-800 border-none
                             rounded-lg text-gray-900 dark:text-slate-100
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button className="bg-yellow-400 text-white dark:text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-yellow-500 transition-colors">
                Add Collaborator
              </button>
            </div>

            <div className="w-full overflow-hidden border border-gray-200 dark:border-slate-700 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 tracking-wider">
                      Project Name
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 tracking-wider">
                      Last Update
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-slate-300 tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
                  {projectsData.map((project, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 whitespace-nowrap font-medium text-gray-900 dark:text-slate-100">
                        {project.name}
                      </td>
                      <td className="p-4 whitespace-nowrap text-gray-600 dark:text-slate-400">
                        {project.lastUpdate}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <ActionButtons />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

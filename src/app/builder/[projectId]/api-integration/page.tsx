import { prisma } from "@/lib/prisma";
import { Plus, Trash2, Key, Copy } from "lucide-react";
import CreateTokenButton from "./create-token-button"; // Kita buat sebentar lagi
import DeleteTokenButton from "./delete-token-button"; // Kita buat sebentar lagi
import CopyTokenButton from "./copy-token-button"; // Opsional

export default async function ApiIntegrationPage({ 
  params 
}: { 
  params: Promise<{ projectId: string }> 
}) {
  const { projectId } = await params;

  // Ambil daftar token dari database
  const tokens = await prisma.apiToken.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex-1 bg-gray-50 h-full p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Integration</h1>
            <p className="text-sm text-gray-500">Manage API tokens for third-party integration.</p>
          </div>
          {/* Tombol Create (Client Component) */}
          <CreateTokenButton projectId={projectId} />
        </div>

        {/* Tabel Token */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Token Prefix</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Key className="mx-auto mb-3 text-gray-300" size={40} />
                    <p>No API tokens found.</p>
                    <p className="text-xs">Create a new token to start integrating.</p>
                  </td>
                </tr>
              ) : (
                tokens.map((token) => (
                  <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {token.name}
                      {token.description && <p className="text-xs text-gray-400 font-normal mt-0.5">{token.description}</p>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {token.token.substring(0, 10)}... ••••
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                        token.role === 'full_access' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {token.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DeleteTokenButton tokenId={token.id} projectId={projectId} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Info Card (Documentation Link) */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-4 items-start">
          <div className="p-2 bg-blue-100 rounded-md text-blue-600 shrink-0">
             <Copy size={20} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Need Help Integration?</h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Use the generated token in your API Header: <br/>
              <code className="bg-white/50 px-1 py-0.5 rounded text-blue-800 font-mono">Authorization: Bearer cm_xxxx...</code>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
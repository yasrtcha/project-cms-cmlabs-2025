import { prisma } from "@/lib/prisma";
import {
  Plus,
  Trash2,
  Key,
  Copy,
  Code,
  Database,
  Globe,
  ChevronRight,
} from "lucide-react";
import SafeDeleteButton from "@/components/safe-delete-button";

export default async function ApiIntegrationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // 1. Fetch Tokens
  const tokens = await prisma.apiToken.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch Content Types (for API Docs)
  const contentTypes = await prisma.builderContentType.findMany({
    where: { projectId },
    include: {
      fieldGroups: {
        include: {
          fields: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const generateExampleResponse = (fields: any[]) => {
    const example: any = {
      id: "cm_entry_xxxx...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fields.forEach((field) => {
      switch (field.type) {
        case "text":
          example[field.apiId] = "Sample text content";
          break;
        case "number":
          example[field.apiId] = 12345;
          break;
        case "media":
          example[field.apiId] = {
            url: "https://example.com/image.jpg",
            alt: "Image description",
          };
          break;
        case "date":
          example[field.apiId] = new Date().toISOString();
          break;
        case "boolean":
          example[field.apiId] = true;
          break;
        case "relation":
          example[field.apiId] = {
            id: "related_entry_id",
            title: "Related Content Title",
          };
          break;
        case "location":
          example[field.apiId] = { lat: -6.2088, lng: 106.8456 };
          break;
        default:
          example[field.apiId] = "value";
      }
    });
    return JSON.stringify(example, null, 2);
  };

  return (
    <div className="flex-1 bg-gray-50 h-full p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Token Prefix</th>
                <th className="px-6 py-4">Access Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tokens.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500">
                    <Key className="mx-auto mb-3 text-gray-300" size={40} />
                    <p>No API tokens found.</p>
                  </td>
                </tr>
              ) : (
                tokens.map((token: any) => (
                  <tr
                    key={token.id}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {token.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {token.token.substring(0, 10)}... ••••
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-bold ${
                          token.role === "full_access"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}>
                        {token.role.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SafeDeleteButton
                        id={token.id}
                        onDelete={async (id: string) => {
                          "use server";
                          await prisma.apiToken.delete({ where: { id } });
                        }}
                        title={`Delete Token "${token.name}"?`}
                        warningMessage="This action cannot be undone."
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-4 items-start">
          <div className="p-2 bg-blue-100 rounded-md text-blue-600 shrink-0">
            <Code size={20} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">
              Authentication Header
            </h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Include this header in all your requests:
              <br />
              <code className="bg-white/50 px-2 py-1 rounded text-blue-800 font-mono mt-1 inline-block">
                Authorization: Bearer YOUR_TOKEN
              </code>
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* SECTION 2: AUTOMATIC API REFERENCE */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="text-orange-500" size={24} />
            API Reference
          </h2>
          <p className="text-sm text-gray-500">
            Automatically generated documentation for your Content Models.
          </p>
        </div>

        {contentTypes.length === 0 ? (
          <div className="text-center py-10 bg-gray-100 rounded-lg border border-gray-200 border-dashed">
            <p className="text-gray-500">
              No content models found. Create a model in builder to see API
              docs.
            </p>
          </div>
        ) : (
          <div className="grid gap-8">
            {contentTypes.map((ct: any) => {
              const allFields = ct.fieldGroups.flatMap((g: any) => g.fields);
              return (
                <div
                  key={ct.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        {ct.name}
                        <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {ct.slug}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {ct.description || `Manage ${ct.name} entries.`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                        GET
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-md">
                        POST
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md">
                        PUT
                      </span>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                        DELETE
                      </span>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Kolom Kiri: Endpoints */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Endpoints
                      </h4>

                      <div className="space-y-3">
                        <div className="group">
                          <div className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <span className="text-green-600">GET</span> Get All
                            Entries
                          </div>
                          <code className="block w-full bg-slate-800 text-slate-100 p-3 rounded-md text-xs font-mono group-hover:bg-slate-700 transition-colors">
                            https://api.cmlabs.co/v1/content/{ct.slug}
                          </code>
                        </div>
                        <div className="group">
                          <div className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-2">
                            <span className="text-green-600">GET</span> Get
                            Single Entry
                          </div>
                          <code className="block w-full bg-slate-800 text-slate-100 p-3 rounded-md text-xs font-mono">
                            https://api.cmlabs.co/v1/content/{ct.slug}/:id
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Kolom Kanan: Example Response */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Response Object
                      </h4>
                      <div className="relative">
                        <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed border border-slate-700 shadow-inner">
                          {generateExampleResponse(allFields)}
                        </pre>
                        <div className="absolute top-2 right-2 text-[10px] text-slate-500 font-bold px-2 py-1 bg-slate-800 rounded">
                          JSON
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

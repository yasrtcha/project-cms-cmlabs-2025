"use client";

// Mock data - will be replaced with API data
const mockProjectUsage = {
  projects: {
    active: 3,
    included: 3,
  },
  roles: {
    perProject: 3,
    projects: [
      { name: "Marketing Website", used: 2, total: 3 },
      { name: "Marketing Website", used: 2, total: 3 },
      { name: "blank", used: 2, total: 3 },
    ],
  },
  collaborators: {
    perProject: 1,
    projects: [
      { name: "Marketing Website", used: "-", total: 1 },
      { name: "Marketing Website", used: "-", total: 1 },
      { name: "blank", used: "-", total: 1 },
    ],
  },
  webhooks: {
    perProject: 5,
    projects: [
      { name: "Marketing Website", used: "-", total: 5 },
      { name: "Marketing Website", used: "-", total: 5 },
      { name: "blank", used: "-", total: 5 },
    ],
  },
  models: {
    perEnvironment: 60,
    projects: [
      { name: "Marketing Website", used: 13, total: 60 },
      { name: "Marketing Website", used: 11, total: 60 },
      { name: "blank", used: 1, total: 60 },
    ],
  },
  locales: {
    perEnvironment: 10,
    projects: [
      { name: "Marketing Website", used: 8, total: 10 },
      { name: "Marketing Website", used: "-", total: 10 },
      { name: "blank", used: "-", total: 10 },
    ],
  },
  records: {
    total: 300,
    used: 157,
    projects: [
      { name: "Marketing Website", used: 82 },
      { name: "Marketing Website", used: 75 },
      { name: "blank", used: "-" },
    ],
  },
};

export function DetailProjectUsage() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-blue-50 dark:bg-slate-700/50 px-6 py-3 border-b border-blue-200 dark:border-slate-700">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
          Detail Project Usage
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Projects Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Projects</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Included in the plan</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {mockProjectUsage.projects.active} active
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mockProjectUsage.projects.active}/{mockProjectUsage.projects.included}
            </p>
          </div>
        </div>

        {/* Roles & Collaborators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-200 dark:border-slate-700">
          {/* Roles */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Roles</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.roles.perProject}/project included
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.roles.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">
                    {project.used}/{project.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Collaborators</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.collaborators.perProject}/project included
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.collaborators.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">
                    {project.used}/{project.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Webhooks & Models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-gray-200 dark:border-slate-700">
          {/* Webhooks */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Webhooks</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.webhooks.perProject}/project included
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.webhooks.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">
                    {project.used}/{project.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Models */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Models</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.models.perEnvironment}/environment included
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.models.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">
                    {project.used}/{project.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Locales & Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Locales */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Locales</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.locales.perEnvironment}/environment included
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.locales.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">
                    {project.used}/{project.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Records */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Records</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {mockProjectUsage.records.used}/{mockProjectUsage.records.total}
              </span>
            </div>
            <div className="space-y-2">
              {mockProjectUsage.records.projects.map((project, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400 italic">{project.name}</span>
                  <span className="text-gray-900 dark:text-white">{project.used}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

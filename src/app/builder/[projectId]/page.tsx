"use client";

export default function ContentBuilderWelcome() {
  return (
    <div className="h-full w-full flex items-center justify-center p-10 bg-white dark:bg-slate-950">
      <div className="max-w-4xl w-full bg-gray-200 dark:bg-slate-900 p-12 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Content Builder
        </h1>
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-6">
          Build your first layout.
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          The Content Builder allows you to visually create and structure your page using flexible and customizable components. It supports various content types to suit your project needs:
        </p>

        <ul className="space-y-6">
          <li>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">• Single Page</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use this when the layout is connected to only one content entry. Suitable for pages like "Home" or "Profile", where the data comes from a single source and doesn't repeat.
            </p>
          </li>
          
          <li>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">• Multiple Page</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Designed for dynamic collections such as blog posts, product listings, or team members. You only need to design the layout once, and it can display multiple entries from your content.
            </p>
          </li>

          <li>
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">• Component</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These are reusable visual components like text sections, images, or others that you can use in page layouts. Components can be customized and arranged freely to match your desired structure.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

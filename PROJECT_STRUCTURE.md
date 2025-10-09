# 🏗️ Project Structure - CMS WeldFine

## 📁 Current Structure

```
src/
├── app/                                    # Next.js App Router
│   ├── page.tsx                           # Homepage (/) - Full Dashboard
│   ├── dashboard/
│   │   ├── page.tsx                       # /dashboard - Full Dashboard
│   │   └── components/                    # Dashboard-specific components
│   │       ├── index.ts                   # Barrel exports
│   │       ├── stats-cards.tsx            # Statistics cards
│   │       ├── activity-chart.tsx         # Bar chart component
│   │       ├── deadlines-chart.tsx        # Pie chart component
│   │       ├── activities-table.tsx       # Activities data table
│   │       └── organization-list.tsx      # Organizations data table
│   ├── organizational/
│   │   └── page.tsx                       # /organizational - Coming Soon
│   ├── personal-project/
│   │   └── page.tsx                       # /personal-project - Coming Soon
│   └── notification/
│       └── page.tsx                       # /notification - Coming Soon
├── components/
│   ├── layout/                            # Layout components (shared)
│   │   ├── sidebar.tsx                    # Navigation sidebar
│   │   └── header.tsx                     # Top header
│   └── ui/                                # Shadcn UI base components
│       ├── card.tsx
│       ├── button.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── chart.tsx
│       └── progress.tsx
├── types/
│   └── dashboard.ts                       # TypeScript type definitions
├── constants/
│   └── dashboard.ts                       # Static data and configuration
└── lib/
    ├── utils.ts                           # General utilities
    └── dashboard-utils.ts                 # Dashboard-specific utilities
```

## 🎯 Page Status

### ✅ **Completed Pages:**
- **Homepage (/)**: Full dashboard with all features
- **Dashboard (/dashboard)**: Same as homepage, fully functional

### 🚧 **Coming Soon Pages:**
- **Organizational (/organizational)**: Shows "This feature will coming soon"
- **Personal Project (/personal-project)**: Shows "This feature will coming soon"  
- **Notifications (/notification)**: Shows "This feature will coming soon"

## 🔗 Navigation

### **Sidebar Navigation:**
- ✅ **Dashboard** → `/` or `/dashboard` (Active, fully functional)
- 🚧 **Organizational** → `/organizational` (Coming soon)
- 🚧 **Personal Project** → `/personal-project` (Coming soon)
- 🚧 **Notification** → `/notification` (Coming soon with badge "3")

### **Active State:**
- Sidebar automatically highlights current page
- Uses Next.js `usePathname()` for route detection

## 🎨 Coming Soon Design

Each coming soon page features:
- **Centered card layout**
- **Icon with themed colors:**
  - Organizational: Blue (Building2 icon)
  - Personal Project: Green (FolderOpen icon)
  - Notifications: Purple (Bell icon)
- **"This feature will coming soon" message**
- **Consistent layout with sidebar and header**

## 📦 Component Organization

### **Shared Components:**
- `src/components/layout/` - Used across all pages
- `src/components/ui/` - Base UI components

### **Page-Specific Components:**
- `src/app/dashboard/components/` - Only used in dashboard pages

## 🚀 Development Workflow

### **To Complete a Coming Soon Page:**
1. Navigate to the specific page file (e.g., `src/app/organizational/page.tsx`)
2. Replace the coming soon content with actual features
3. Import necessary components from `@/app/dashboard/components` or create new ones
4. Update the page layout as needed

### **To Add New Pages:**
1. Create new folder in `src/app/`
2. Add `page.tsx` with the page component
3. Add route to `MENU_ITEMS` in `src/constants/dashboard.ts`
4. Sidebar will automatically include the new page

## 💡 Key Features

- **File-based routing** with Next.js App Router
- **Responsive design** with Tailwind CSS
- **Component reusability** with proper organization
- **Type safety** with TypeScript
- **Consistent navigation** with active states
- **Scalable architecture** for future features

## 🎯 Next Steps

1. **Complete feature pages** by replacing coming soon content
2. **Add more dashboard widgets** in dashboard components
3. **Implement authentication** if needed
4. **Add data fetching** for real data
5. **Enhance UI/UX** based on requirements

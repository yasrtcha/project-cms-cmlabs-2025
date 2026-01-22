"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRelationOptions } from "@/app/builder/_actions/content-entry-actions";

interface AsyncRelationSelectProps {
  contentTypeId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AsyncRelationSelect({ contentTypeId, value, onChange, placeholder = "Select item..." }: AsyncRelationSelectProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  
  // Debounce search (tunggu user selesai mengetik)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        fetchOptions(searchTerm);
      }
    }, 300); // Delay 300ms

    return () => clearTimeout(timer);
  }, [searchTerm, open]);

  // Load initial label if value exists
  useEffect(() => {
    if (value && !selectedLabel) {
        // Fetch sekali saja untuk mendapatkan label dari ID yang tersimpan
        fetchOptions("").then(opts => {
            const found = opts.find(o => o.value === value);
            if (found) setSelectedLabel(found.label);
        });
    }
  }, [value]);

  const fetchOptions = async (query: string) => {
    setLoading(true);
    const res = await getRelationOptions(contentTypeId, query);
    if (res.success && res.data) {
      setOptions(res.data);
    }
    setLoading(false);
    return res.data || []; // Return data for chaining
  };

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg text-sm text-left focus:ring-2 focus:ring-blue-500 transition-all hover:bg-gray-50"
      >
        <span className={cn("truncate", !value && "text-gray-400")}>
          {value ? (selectedLabel || "Loading...") : placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-100 px-3 py-2 sticky top-0 bg-white rounded-t-lg">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-gray-400"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                No results found.
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value === value ? "" : option.value);
                    setSelectedLabel(option.label);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-900",
                    value === option.value && "bg-blue-50 text-blue-900 font-medium"
                  )}
                >
                  <span className="flex-1 truncate">{option.label}</span>
                  {value === option.value && (
                    <Check className="ml-auto h-4 w-4 text-blue-600" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Overlay click to close */}
      {open && (
        <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)} 
        />
      )}
    </div>
  );
}
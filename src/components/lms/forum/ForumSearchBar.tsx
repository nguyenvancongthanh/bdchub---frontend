"use client";

import { useState } from"react";
import { Button } from"@/components/ui/button";
import { Search, SlidersHorizontal } from"lucide-react";

interface ForumSearchBarProps {
 sortBy: 'votes' | 'newest' | 'oldest' | 'views';
 onSortChange: (sort: 'votes' | 'newest' | 'oldest' | 'views') => void;
 onSearch: (search: string, tags: string) => void;
}

export default function ForumSearchBar({ sortBy, onSortChange, onSearch }: ForumSearchBarProps) {
 const [searchInput, setSearchInput] = useState('');
 const [tagsInput, setTagsInput] = useState('');
 const [showFilters, setShowFilters] = useState(false);

 const handleSearch = () => {
 onSearch(searchInput, tagsInput);
 };

 const handleKeyPress = (e: React.KeyboardEvent) => {
 if (e.key === 'Enter') {
 handleSearch();
 }
 };

 return (
 <div className="bg-bg-card rounded-2xl border border-border-subtle p-6 space-y-4 shadow-sm">
 {/* Search Bar */}
 <div className="flex gap-2">
 <div className="flex-1 relative">
 <input
 type="text"
 value={searchInput}
 onChange={(e) => setSearchInput(e.target.value)}
 onKeyPress={handleKeyPress}
 placeholder="Tìm kiếm trong tiêu đề và nội dung..."
 className="w-full pl-10 pr-4 py-3 border border-border-input bg-bg-card text-text-heading placeholder:text-text-disabled dark:placeholder:text-text-muted rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
 />
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-disabled dark:text-text-muted" />
 </div>
 <Button
 onClick={handleSearch}
 className="bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold rounded-xl px-6 py-3 shadow-sm transition-all active:scale-95"
 >
 Tìm kiếm
 </Button>
 <Button
 onClick={() => setShowFilters(!showFilters)}
 className="flex items-center gap-2 bg-bg-card border border-border-input text-text-body hover:bg-bg-hover rounded-xl px-4 py-3 font-medium transition-all"
 >
 <SlidersHorizontal className="w-4 h-4" />
 Lọc
 </Button>
 </div>

 {/* Filters */}
 {showFilters && (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
 <div>
 <label className="block text-sm font-semibold text-text-heading mb-2">Sắp xếp theo</label>
 <select
 value={sortBy}
 onChange={(e) => onSortChange(e.target.value as any)}
 className="w-full px-3 py-2 border border-border-input bg-bg-card text-text-heading rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
 >
 <option value="votes">Điểm cao nhất</option>
 <option value="newest">Mới nhất</option>
 <option value="oldest">Cũ nhất</option>
 <option value="views">Xem nhiều nhất</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-semibold text-text-heading mb-2">Lọc theo tags (phân cách bằng dấu phẩy)</label>
 <input
 type="text"
 value={tagsInput}
 onChange={(e) => setTagsInput(e.target.value)}
 onKeyPress={handleKeyPress}
 placeholder="vd: javascript,react,typescript"
 className="w-full px-3 py-2 border border-border-input bg-bg-card text-text-heading placeholder:text-text-disabled dark:placeholder:text-text-muted rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
 />
 </div>
 </div>
 )}

 {/* Quick Sort Buttons */}
 <div className="flex gap-2 flex-wrap">
 <button
 onClick={() => onSortChange('votes')}
 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
 sortBy === 'votes'
 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
 : 'bg-bg-section text-text-muted hover:bg-bg-hover'
 }`}
 >
 🔥 Phổ biến
 </button>
 <button
 onClick={() => onSortChange('newest')}
 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
 sortBy === 'newest'
 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
 : 'bg-bg-section text-text-muted hover:bg-bg-hover'
 }`}
 >
 ⏰ Mới nhất
 </button>
 <button
 onClick={() => onSortChange('views')}
 className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
 sortBy === 'views'
 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
 : 'bg-bg-section text-text-muted hover:bg-bg-hover'
 }`}
 >
 👁️ Xem nhiều
 </button>
 </div>
 </div>
 );
}
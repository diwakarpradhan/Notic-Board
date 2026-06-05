import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Edit2, AlertCircle } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setNotices(notices.filter(n => n.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete notice:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Notice Board</h1>
            <p className="text-slate-600">Manage and view all notices</p>
          </div>
          <Link
            href="/notices/new"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Add Notice
          </Link>
        </div>

        {/* Notices Grid */}
        {notices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg">No notices yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col"
              >
                {/* Image */}
                {notice.image && (
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-40 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-base sm:text-lg line-clamp-2">
                        {notice.title}
                      </h3>
                    </div>
                    {notice.priority === 'Urgent' && (
                      <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                        <AlertCircle size={14} />
                        Urgent
                      </div>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                    {notice.body}
                  </p>

                  <div className="space-y-2 mb-4 text-xs text-slate-500">
                    <div className="flex gap-2">
                      <span className="bg-slate-100 px-2 py-1 rounded">{notice.category}</span>
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {new Date(notice.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <Link
                      href={`/notices/${notice.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-2 px-3 rounded transition-colors text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(notice.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-3 rounded transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Notice?</h2>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this notice? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface Notice {
  id?: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  image?: string;
}

export default function NoticeForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = !!id;

  const [notice, setNotice] = useState<Notice>({
    title: '',
    body: '',
    category: 'General',
    priority: 'Normal',
    publishDate: new Date().toISOString().split('T')[0],
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      fetchNotice(id as string);
    }
  }, [id, isEditMode]);

  const fetchNotice = async (noticeId: string) => {
    try {
      const res = await fetch(`/api/notices/${noticeId}`);
      if (res.ok) {
        const data = await res.json();
        setNotice({
          ...data,
          publishDate: new Date(data.publishDate).toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Failed to fetch notice:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!notice.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!notice.body.trim()) {
      newErrors.body = 'Body is required';
    }
    if (!notice.publishDate) {
      newErrors.publishDate = 'Publish date is required';
    } else {
      const date = new Date(notice.publishDate);
      if (isNaN(date.getTime())) {
        newErrors.publishDate = 'Please enter a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode ? `/api/notices/${notice.id}` : '/api/notices';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notice,
          publishDate: new Date(notice.publishDate).toISOString(),
        }),
      });

      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        setErrors({ form: data.error || 'Failed to save notice' });
      }
    } catch (error) {
      console.error('Failed to save notice:', error);
      const errorMsg = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setErrors({ form: errorMsg });
    } finally {
      setSubmitting(false);
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-900" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isEditMode ? 'Edit Notice' : 'Create Notice'}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEditMode ? 'Update notice details' : 'Add a new notice to the board'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sm:p-8">
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter notice title"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Body *
              </label>
              <textarea
                value={notice.body}
                onChange={(e) => setNotice({ ...notice, body: e.target.value })}
                rows={5}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.body ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter notice body"
              />
              {errors.body && (
                <p className="text-red-600 text-sm mt-1">{errors.body}</p>
              )}
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Category
                </label>
                <select
                  value={notice.category}
                  onChange={(e) => setNotice({ ...notice, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Exam</option>
                  <option>Event</option>
                  <option>General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Priority
                </label>
                <select
                  value={notice.priority}
                  onChange={(e) => setNotice({ ...notice, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Publish Date *
              </label>
              <input
                type="date"
                value={notice.publishDate}
                onChange={(e) => setNotice({ ...notice, publishDate: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.publishDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.publishDate && (
                <p className="text-red-600 text-sm mt-1">{errors.publishDate}</p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={notice.image || ''}
                onChange={(e) => setNotice({ ...notice, image: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Link
                href="/"
                className="flex-1 text-center px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
              >
                {submitting ? 'Saving...' : isEditMode ? 'Update Notice' : 'Create Notice'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

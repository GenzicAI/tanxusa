'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Clock, Circle, Upload, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Milestone {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
}

interface ProjectProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    progress: number;
    imageUrl: string | null;
    milestones: Milestone[];
    _count: { files: number; messages: number };
    createdAt: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

export function ProjectCard({ project, isSelected, onSelect }: ProjectProps) {
  const [uploading, setUploading] = useState(false);
  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  const milestoneIcons: Record<string, any> = {
    completed: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    in_progress: <Clock className="w-4 h-4 text-blue-500" />,
    pending: <Circle className="w-4 h-4 text-gray-400" />,
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await fetch('/api/upload/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          isPublic: false,
          projectId: project?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'Upload failed');

      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudStoragePath: data.cloud_storage_path,
          isPublic: false,
          projectId: project?.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });
    } catch (err: any) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-emerald-200 transition-all">
      <button
        onClick={onSelect}
        className="w-full p-6 text-left flex items-center gap-4"
      >
        {project?.imageUrl && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <Image src={project.imageUrl} alt={project?.title ?? 'Project'} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-gray-900 truncate">{project?.title ?? 'Untitled'}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project?.status ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
              {(project?.status ?? 'pending')?.replace?.('_', ' ')?.toUpperCase?.() ?? 'PENDING'}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{project?.description ?? ''}</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${project?.progress ?? 0}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-emerald-600">{project?.progress ?? 0}%</span>
          </div>
        </div>
        {isSelected ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-50 pt-4">
              {/* Milestones */}
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Milestones</h4>
              {(project?.milestones?.length ?? 0) === 0 ? (
                <p className="text-sm text-gray-400">No milestones yet</p>
              ) : (
                <div className="space-y-2 mb-6">
                  {(project?.milestones ?? []).map((m: Milestone) => (
                    <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      {milestoneIcons[m?.status ?? 'pending'] ?? milestoneIcons.pending}
                      <span className="text-sm text-gray-700 flex-1">{m?.title ?? 'Untitled'}</span>
                      {m?.dueDate && (
                        <span className="text-xs text-gray-400">{new Date(m.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload File'}
                  <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
                <span className="text-xs text-gray-400">
                  {project?._count?.files ?? 0} files · {project?._count?.messages ?? 0} messages
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

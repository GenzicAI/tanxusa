'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, LogOut, FolderOpen, Calendar, Bot, MessageCircle, Upload, ChevronRight, BarChart3, Clock } from 'lucide-react';
import { ProjectCard } from './project-card';
import { ChatPanel } from './chat-panel';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  imageUrl: string | null;
  milestones: Array<{ id: string; title: string; status: string; dueDate: string | null }>;
  _count: { files: number; messages: number };
  createdAt: string;
}

export function DashboardContent() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data ?? []);
      }
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  const activeProjects = (projects ?? []).filter((p: Project) => p?.status === 'in_progress');
  const completedProjects = (projects ?? []).filter((p: Project) => p?.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="TanXUSA logo" className="w-9 h-9 rounded-lg object-cover" />
            <img src="/wordmark.jpg" alt="TanXUSA" className="h-7 object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, {session?.user?.name ?? 'Client'}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{activeProjects?.length ?? 0}</div>
                <div className="text-sm text-gray-500">Active Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(projects ?? []).reduce((acc: number, p: Project) => acc + (p?.milestones?.length ?? 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Milestones</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                <Bot className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </div>
                <div className="text-sm text-gray-500">AI Agents</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedProjects?.length ?? 0}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900">Your Projects</h2>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {showChat ? 'Hide Chat' : 'AI Assistant'}
          </button>
        </div>

        <div className={`grid ${showChat ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          <div className={showChat ? 'lg:col-span-2' : ''}>
            {(projects?.length ?? 0) === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
                <p className="text-gray-500 text-sm">Your projects will appear here once they're created by the TanXUSA team.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(projects ?? []).map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isSelected={selectedProject === project.id}
                    onSelect={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {showChat && (
            <div className="lg:col-span-1">
              <ChatPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

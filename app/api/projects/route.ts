export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any)?.id;
    const userRole = (session.user as any)?.role;

    let projects;
    if (userRole === 'admin') {
      projects = await prisma.project.findMany({
        include: {
          milestones: { orderBy: { createdAt: 'asc' } },
          _count: { select: { files: true, messages: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { clientId: userId },
        include: {
          milestones: { orderBy: { createdAt: 'asc' } },
          _count: { select: { files: true, messages: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return NextResponse.json(projects ?? []);
  } catch (error: any) {
    console.error('Projects fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

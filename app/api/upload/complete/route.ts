export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cloudStoragePath, isPublic, projectId, fileName, fileType, fileSize } = await request.json();
    if (!cloudStoragePath || !projectId || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = (session.user as any)?.id;
    const file = await prisma.projectFile.create({
      data: {
        fileName,
        fileType: fileType ?? null,
        fileSize: fileSize ?? null,
        cloudStoragePath,
        isPublic: isPublic ?? false,
        projectId,
        uploadedById: userId,
      },
    });

    return NextResponse.json(file);
  } catch (error: any) {
    console.error('Upload complete error:', error);
    return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 });
  }
}

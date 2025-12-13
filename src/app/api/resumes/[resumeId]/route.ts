import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT: Update a specific resume's content
export async function PUT(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  try {
    const { resumeId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { content } = await request.json();

    // Verify that the resume belongs to the current user
    const existingResume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!existingResume) {
      return new Response(JSON.stringify({ error: 'Resume not found or unauthorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedResume = await prisma.resume.update({
      where: {
        id: resumeId,
      },
      data: {
        content: content,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Response(JSON.stringify(updatedResume), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    return new Response(JSON.stringify({ error: 'Failed to update resume' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET: Fetch a specific resume (if needed)
export async function GET(request: NextRequest, { params }: { params: Promise<{ resumeId: string }> }) {
  try {
    const { resumeId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!resume) {
      return new Response(JSON.stringify({ error: 'Resume not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(resume), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resume' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
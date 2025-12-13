import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: Fetch all resumes for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Response(JSON.stringify(resumes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch resumes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// POST: Create a new resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const defaultResumeContent = {
      personalDetail: {
        fullName: '',
        email: '',
        phone: '',
        headline: '',
        address: '',
        photoUrl: '',
        socialLinks: {
          linkedin: '',
          github: '',
          portfolio: '',
          twitter: '',
          website: '',
        },
      },
      sections: [],
    };

    const newResume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: 'Untitled Resume',
        content: defaultResumeContent,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Response(JSON.stringify(newResume), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    return new Response(JSON.stringify({ error: 'Failed to create resume' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
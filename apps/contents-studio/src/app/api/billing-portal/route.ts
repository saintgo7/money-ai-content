import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@repo/auth/config';
import { createBillingPortalSession } from '@repo/payments';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const portalSession = await createBillingPortalSession({
      userId: session.user.id,
      returnUrl: `${baseUrl}/pricing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('Billing portal error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

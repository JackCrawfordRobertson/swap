import { NextResponse } from 'next/server';
import { db } from '../../../config/firebaseAdminConfig';
import sgMail from '@sendgrid/mail';
import { createDisapprovalEmailTemplate } from '@/utils/email/emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ message: 'Invalid or missing user ID.' }, { status: 400 });

  try {
    const userRef = db.collection('pendingUsers').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    const { email, username } = userDoc.data();
    if (!email || !username) {
      return NextResponse.json({ message: 'User data incomplete.' }, { status: 422 });
    }

    await userRef.delete();

    const emailContent = createDisapprovalEmailTemplate({ username });
    await sgMail.send({
      to: email,
      from: 'support@ice-hub.biz',
      subject: 'Registration Disapproved',
      html: emailContent,
    });

    return NextResponse.json({ message: 'User disapproved and removed from pendingUsers.' }, { status: 200 });

  } catch (error) {
    console.error('Error disapproving user:', error.message);
    return NextResponse.json({ message: 'Error during disapproval.', error: error.message }, { status: 500 });
  }
}
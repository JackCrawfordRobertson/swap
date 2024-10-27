// src/app/api/disapproveUser/route.js

import { NextResponse } from 'next/server';
import { db } from '../../../config/firebaseAdminConfig'; // Use the Admin SDK config
import sgMail from '@sendgrid/mail';
import { createDisapprovalEmailTemplate } from '@/utils/email/emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log(`Received request to disapprove user with ID: ${userId}`);

  try {
    // Fetch user from 'pendingUsers' collection using Admin SDK
    const userRef = db.collection('pendingUsers').doc(userId);
    const userDoc = await userRef.get();
    console.log(`User document fetched: ${userDoc.exists ? 'Found' : 'Not Found'}`);

    if (!userDoc.exists) {
      console.warn(`User document not found for ID: ${userId}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { email, username } = userDoc.data();
    console.log(`User found: ${username} (${email})`);

    // Delete the user from 'pendingUsers' collection
    await userRef.delete();
    console.log(`User removed from pendingUsers collection for ID: ${userId}`);

    // Send disapproval email using the formatted HTML template
    const emailContent = createDisapprovalEmailTemplate({ username });
    await sgMail.send({
      to: email,
      from: 'support@ice-hub.biz',
      subject: 'Registration Disapproved',
      html: emailContent,
    });
    console.log(`Disapproval email sent to: ${email}`);

    return NextResponse.json(
      { message: 'User disapproved and removed from pendingUsers.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error disapproving user:', error.message);
    return NextResponse.json(
      { message: 'Failed to disapprove user.', error: error.message },
      { status: 500 }
    );
  }
}
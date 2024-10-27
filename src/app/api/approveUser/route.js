// src/app/api/approveUser/route.js

import { NextResponse } from 'next/server';
import { db, auth } from '../../../config/firebaseAdminConfig'; // Use the Admin SDK config
import sgMail from '@sendgrid/mail';
import { createApprovalEmailTemplate } from '@/utils/email/emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    // Fetch user from 'pendingUsers' collection
    const userRef = db.collection('pendingUsers').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { email, password, username } = userDoc.data();

    // Validate retrieved data
    if (!email || !password || !username) {
      throw new Error('Incomplete user data');
    }

    // Create user in Firebase Auth using the Admin SDK
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Save user data in the 'users' collection
    await db.collection('users').doc(userRecord.uid).set({
      email,
      username,
      createdAt: new Date(),
    });

    // Delete the user from 'pendingUsers' collection
    await userRef.delete();

    // Send approval email using the formatted HTML template
    const emailContent = createApprovalEmailTemplate({ username });
    await sgMail.send({
      to: email,
      from: 'support@ice-hub.biz',
      subject: 'Registration Approved - Welcome to SWAP!',
      html: emailContent,
    });

    return NextResponse.json(
      { message: 'User approved and added to Firebase Auth.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving user:', error.message);
    return NextResponse.json(
      { message: 'Failed to approve user.' },
      { status: 500 }
    );
  }
}
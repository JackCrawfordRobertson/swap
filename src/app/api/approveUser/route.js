// src/app/api/approveUser/route.js

import { NextResponse } from 'next/server';
import { db, auth } from '../../../config/firebaseAdminConfig';
import sgMail from '@sendgrid/mail';
import { createApprovalEmailTemplate } from '@/utils/email/emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    // Fetch user from 'pendingUsers' collection
    const userRef = db.collection('pendingUsers').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Safely access data and add default fallbacks
    const userData = userDoc.data() || {}; // Provide empty object if undefined
    const { email = null, password = null, username = null } = userData;

    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json({ message: 'User data is incomplete' }, { status: 400 });
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
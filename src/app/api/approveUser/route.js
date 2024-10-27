// src/app/api/approveUser/route.js

import { NextResponse } from 'next/server';
import { db, auth } from '../../../config/firebaseAdminConfig'; // Use the Admin SDK config
import sgMail from '@sendgrid/mail';
import { createApprovalEmailTemplate } from '@/utils/email/emailTemplate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  console.log(`Received request to approve user with ID: ${userId}`);

  try {
    const userRef = db.collection('pendingUsers').doc(userId);
    console.log(`Fetching user document for ID: ${userId}`);

    const userDoc = await userRef.get();
    console.log(`User document fetched: ${userDoc.exists ? 'Found' : 'Not Found'}`);

    if (!userDoc.exists) {
      console.warn(`User document not found for ID: ${userId}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { email, password, username } = userDoc.data();
    console.log(`User found: ${username} (${email})`);

    // Create user using the Admin SDK
    console.log('Attempting to create user in Firebase Auth using Admin SDK...');
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });
    console.log(`User created in Firebase Auth: ${userRecord.uid}`);

    // Save user data in the 'users' collection
    await db.collection('users').doc(userRecord.uid).set({
      email,
      username,
      createdAt: new Date(),
    });
    console.log(`User data saved in 'users' collection for user ID: ${userRecord.uid}`);

    // Delete the user from pendingUsers
    await userRef.delete();
    console.log(`User removed from pendingUsers collection for ID: ${userId}`);

    // Send approval email using the formatted HTML template
    const emailContent = createApprovalEmailTemplate({ username });
    await sgMail.send({
      to: email,
      from: 'support@ice-hub.biz',
      subject: 'Registration Approved - Welcome to SWAP!',
      html: emailContent,
    });
    console.log(`Approval email sent to: ${email}`);

    return NextResponse.json(
      { message: 'User approved and added to Firebase Auth.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error approving user:', error.message);
    return NextResponse.json(
      { message: 'Failed to approve user.', error: error.message },
      { status: 500 }
    );
  }
}
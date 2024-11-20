import { NextResponse } from "next/server";
import initializeAdmin from "../../../config/firebaseAdminConfig";
import sgMail from "@sendgrid/mail";
import { createApprovalEmailTemplate } from "@/utils/email/emailTemplate";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function GET(request) {
  const { db, auth } = await initializeAdmin(); // Dynamically initialize Firebase Admin
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Invalid or missing user ID." }, { status: 400 });
  }

  try {
    const userRef = db.collection("pendingUsers").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const { email, password, username } = userDoc.data();
    if (!email || !password || !username) {
      return NextResponse.json({ message: "User data incomplete." }, { status: 422 });
    }

    const userRecord = await auth.createUser({ email, password, displayName: username });
    await db.collection("users").doc(userRecord.uid).set({
      email,
      username,
      createdAt: new Date(),
    });

    await userRef.delete();

    const emailContent = createApprovalEmailTemplate({ username });
    try {
      await sgMail.send({
        to: email,
        from: "support@ice-hub.biz",
        subject: "Registration Approved - Welcome!",
        html: emailContent,
      });
    } catch (emailError) {
      console.warn("Email send failed:", emailError.message);
    }

    return NextResponse.json({ message: "User approved and added to Firebase Auth." }, { status: 200 });
  } catch (error) {
    console.error("Error approving user:", error.message);
    return NextResponse.json({ message: "Error during approval.", error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import initializeAdmin from "../../../config/firebaseAdminConfig";
import sgMail from "@sendgrid/mail";
import { createDisapprovalEmailTemplate } from "@/utils/email/emailTemplate";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Exclude this route from prerendering
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { db } = await initializeAdmin(); // Dynamically initialize Firebase Admin
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    console.error("Invalid or missing user ID");
    return NextResponse.json({ message: "Invalid or missing user ID." }, { status: 400 });
  }

  try {
    const userRef = db.collection("pendingUsers").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("User not found");
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const { email, username } = userDoc.data();
    if (!email || !username) {
      console.error("Incomplete user data");
      return NextResponse.json({ message: "User data incomplete." }, { status: 422 });
    }

    await userRef.delete();

    const emailContent = createDisapprovalEmailTemplate({ username });
    await sgMail.send({
      to: email,
      from: "support@ice-hub.biz",
      subject: "Registration Disapproved",
      html: emailContent,
    });

    console.log(`User ${userId} disapproved and email sent`);
    return NextResponse.json({ message: "User disapproved and removed from pendingUsers." }, { status: 200 });
  } catch (error) {
    console.error("Error disapproving user:", error.message);
    return NextResponse.json({ message: "Error during disapproval.", error: error.message }, { status: 500 });
  }
}
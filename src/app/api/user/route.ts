import { Purchase, User } from "@/dbSchema/User";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongo";
import { Db } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export interface UserResponse {
  email: string,
  creditsRemaining: number,
  error?: string,
};

export async function GET(req: NextRequest) {
  // Connect to your DB, fetch data, etc.
  const session = await auth(); 
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'You are not logged in' }, {status: 401});
  }
  const db = await getDb(); 
  const user = await db.collection<User>('users').findOne({email: userEmail});
  return NextResponse.json<UserResponse>({ email: userEmail, creditsRemaining: user?.creditsRemaining ?? 0 });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'You are not logged in' }, {status: 401});
  }
  const body = await req.json();
  const db = await getDb(); 
  if (body.action === "lockCredit") {
    return lockCredit(db, userEmail, body);
  } else if (body.action === "verifyPayment") {
    return verifyPayment(db, userEmail, body.id);
  }
  return NextResponse.json({ error: 'Unknown action' });
}

async function lockCredit(db: Db, userEmail: string, body: any): Promise<NextResponse> {
  const user = await db.collection<User>('users').findOne({email: userEmail});
  if (user?.creditsRemaining === 0) {
    return NextResponse.json({ success: false, error: 'No credits remaining' });
  }
  const usageDoc = {
    time: new Date(),
    profile: body.profile
  };
  const updateResult = await db.collection<User>('users').findOneAndUpdate({email: userEmail, creditsRemaining: {$gt: 0}}, { $inc: {creditsRemaining: -1}, $push: { usageHistory: usageDoc } }, { returnDocument: "after" });
  console.log(`lockCredit for user ${userEmail} remainingCreds ${updateResult?.creditsRemaining}`);
  return NextResponse.json({ success: true, creditsRemaining: updateResult?.creditsRemaining });
}

function maskedEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length + parts[1].length < 8) {
    return "*";
  }
  if (parts[0].length > 3) return parts[0].substring(0, 3) + "*".repeat(parts[0].length - 3) + "@" + parts[1];
  return parts[0][0] + "*".repeat(parts[0].length - 1) + "@" + parts[1][0] + "*".repeat(parts[1].length - 1);
}

async function verifyPayment(db: Db, userEmail: string, id: string): Promise<NextResponse> {
  const usedPurchaseId = await db.collection<User>('users').findOne({'purchaseHistory.dodoId': id});
  if (usedPurchaseId) {
    console.log(`Trying to reuse payment by user ${userEmail} existing: ${usedPurchaseId.email} id: ${id}`);
    return NextResponse.json({ success: false, error: 'Payment already claimed by user: ' + maskedEmail(usedPurchaseId.email)})
  }
  const paymentDetailsResponse = await fetch(`${process.env.DODO_API}/payments/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DODO_API_KEY}`
    },
  });
  if (!paymentDetailsResponse.ok) {
    return NextResponse.json({ success: false, error: 'Unable to verify payment ' + id });
  }
  const paymentDetails = await paymentDetailsResponse.json();
  if (paymentDetails.status !== 'succeeded') {
    console.log(`Payment has not succeeded by user ${userEmail}, status: ${paymentDetails.status} ${id}`);
    return NextResponse.json({ success: false, error: 'Payment has not succeeded, status: ' + paymentDetails.status });
  }
  console.log('Successfully verified payment ' + id, paymentDetails);
  const purchase = {
    time: new Date(),
    dodoId: id,
    amount: 10,
    currency: "USD",
    creditsAdded: 10
  } as Purchase;
  const updateResult = await db.collection<User>('users').findOneAndUpdate({email: userEmail}, { $inc: {creditsRemaining: purchase.creditsAdded }, $push: { purchaseHistory: purchase } }, { returnDocument: "after" })
  console.log('updatePurchase update result', updateResult);
  return NextResponse.json({ success: true, creditsRemaining: updateResult?.creditsRemaining });
}
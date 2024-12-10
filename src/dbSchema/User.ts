export type User = {
  email: string,
  creditsRemaining: number,
  purchaseHistory: Purchase[],
  usageHistory: Usage[],
};

export type Purchase = {
  time: Date,
  dodoId: string,
  amount: number,
  currency: "USD",
  creditsAdded: number
}

export type Usage = {
  time: Date,
  profile: string,
}
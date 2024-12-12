import PremiumModal from "@/components/premium/PremiumModal";
import Navbar from "./navbar";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import SubscriptionLevelProvider from "./SubscriptionLevelProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const userSubscriptionLevel = await getUserSubscriptionLevel(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
        <Navbar />
        {children}
        <PremiumModal />
      </SubscriptionLevelProvider>
    </div>
  );
}

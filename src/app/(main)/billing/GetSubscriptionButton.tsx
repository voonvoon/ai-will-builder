"use client";

import {Button} from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";

export default function GetSubscriptionButton() {
    const PremiumModal = usePremiumModal();

    return(
        <Button onClick={() => PremiumModal.setOpen(true)} variant="premium">
            Get Premium Subscription
        </Button>
    )


 }
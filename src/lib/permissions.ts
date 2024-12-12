import { SubscriptionLevel } from "./subscription";

export function canCreateWill(
    subscriptionLevel: SubscriptionLevel,
    currentWillCount: number,
) {
    //Record<SubscriptionLevel, number> defines an object where the keys are subscription levels and the values are numbers.
    //Purpose: Ensures type safety by specifying the types of keys and values in an object.
    const maxWillMap: Record<SubscriptionLevel, number> = {
        free: 1,
        pro: 5,
        pro_plus: Infinity, // Infinity is a special value that represents positive infinity in js, inst't it funny?
    };

    const maxWills = maxWillMap[subscriptionLevel]

    return currentWillCount < maxWills;
}

export function canUseAITools(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel !== "free";
}

export function canUseCustomizations(subscriptionLevel: SubscriptionLevel) {
    return subscriptionLevel === "pro_plus";
}
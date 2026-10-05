export const CURRENCY_ICON = "💎";
export const STREAK_FREEZE_ICON = "❄️";
export const STREAK_FREEZE_ITEM_ID = "streak_freeze";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  maxOwned: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: STREAK_FREEZE_ITEM_ID,
    name: "Заморозка стрика",
    description:
      "Закрывает один пропущенный день автоматически: если в день ничего не изучено, заморозка тратится сама.",
    icon: STREAK_FREEZE_ICON,
    price: 20,
    maxOwned: 3,
  },
];

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

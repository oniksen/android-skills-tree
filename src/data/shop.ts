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
      "Закрывает один пропущенный день и продлевает стрик. Применяется вручную в недельной сетке стрика.",
    icon: STREAK_FREEZE_ICON,
    price: 50,
    maxOwned: 3,
  },
];

export function getShopItem(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

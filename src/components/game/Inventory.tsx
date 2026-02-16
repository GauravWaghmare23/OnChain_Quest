import { useGame } from "@/context/GameContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Inventory = () => {
  const { inventory } = useGame();

  const emptySlots = Math.max(0, 12 - inventory.length);

  return (
    <div className="w-full space-y-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-green-900">🎒 Inventory</h2>
        <p className="text-xs text-gray-600">Slots: {inventory.length} / 12</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {inventory.map((item) => (
          <Card
            key={item.id}
            className="border-2 border-green-400 rounded-none bg-green-50 cursor-pointer hover:bg-green-100 transition-all"
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-xs font-bold text-green-900 mb-1">{item.name}</p>
              <p className="text-xs text-gray-600 mb-2">{item.description}</p>
              <Badge className="bg-green-600 text-white text-xs">x{item.count}</Badge>
            </CardContent>
          </Card>
        ))}

        {Array(emptySlots)
          .fill(null)
          .map((_, i) => (
            <Card
              key={`empty_${i}`}
              className="border-2 border-gray-300 border-dashed rounded-none bg-gray-50"
            >
              <CardContent className="p-4 text-center flex items-center justify-center h-24">
                <p className="text-xs text-gray-400">Empty</p>
              </CardContent>
            </Card>
          ))}
      </div>

      {inventory.length === 0 && (
        <Card className="border-2 border-yellow-400 rounded-none bg-yellow-50">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-yellow-900 font-bold">
              Your inventory is empty! Complete quests to earn items.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

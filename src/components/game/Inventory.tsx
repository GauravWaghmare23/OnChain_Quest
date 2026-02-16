import { useGame } from "@/context/GameContext";

const Inventory = () => {
  const { inventory } = useGame();
  const slots = 8;
  const items = [...inventory, ...Array(Math.max(0, slots - inventory.length)).fill(null)];

  return (
    <div className="quest-panel space-y-3">
      <h3 className="text-[10px] text-accent pixel-text-shadow">🎒 INVENTORY</h3>
      <div className="grid grid-cols-4 gap-1">
        {items.slice(0, slots).map((item, i) => (
          <div key={i} className="inventory-slot" title={item || "Empty"}>
            {item ? (
              <span className="text-lg animate-pixel-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {item.split(" ")[0]}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;

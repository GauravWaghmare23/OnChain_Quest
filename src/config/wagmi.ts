import { http, createConfig } from "wagmi";
import { bscTestnet, bsc } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
});

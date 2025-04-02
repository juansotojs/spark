interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (params: any) => void) => void;
  removeListener: (eventName: string, callback: (params: any) => void) => void;
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {}; 
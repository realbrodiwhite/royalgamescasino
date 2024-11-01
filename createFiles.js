const fs = require('fs');
const path = require('path');

const directories = [
  'src/hooks',
  'src/utils',
  'src/types',
  'src/store',
  'src/services',
  'src/context',
  'src/config',
  'src/styles',
];

const files = {
  'src/hooks/useSocket.ts': `import { useContext } from 'react';
import { SocketContext } from '@context/socket';

export const useSocket = () => {
  return useContext(SocketContext);
};`,

  'src/utils/assetLoader.ts': `import { Assets } from 'pixi.js';
import { GameAssets } from '@types/assets';

export const loadGameAssets = async (gameId: string): Promise<GameAssets> => {
  // Implementation
};`,

  'src/types/game.ts': `export interface GameConfig {
  id: string;
  name: string;
  // ...other properties
};`,

  'src/store/gameStore.ts': `import { create } from 'zustand';
import { GameState } from '@types/game';

export const useGameStore = create<GameState>((set) => ({
  // Store implementation
}));`,

  'src/services/GameService.ts': `import { GameConfig } from '@types/game';
import { apiClient } from '@utils/apiClient';

export class GameService {
  static async loadGame(id: string): Promise<GameConfig> {
    // Implementation
  }
};`,

  'src/context/socket.ts': `import { createContext } from 'react';
import { io } from 'socket.io-client';
import { SocketConfig } from '@types/socket';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
export const SocketContext = createContext(socket);`,

  'src/config/games.ts': `import type { GameConfig } from '@types/game';

export const gameConfigs: Record<string, GameConfig> = {
  // Game configurations
};`,

  'src/styles/game.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .game-container {
    @apply w-full flex-1 flex justify-center items-center bg-black;
  }
};`
};

// Create directories
directories.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// Create files with content
for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filePath), content);
}

console.log('Project structure created successfully!');
// src/components/game/Game.tsx
import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Reel } from '@slot/Reel';
import { SlotGame } from '@slot/SlotGame';
import { useSocket } from '@hooks/useSocket';
import { loadGameAssets } from '@utils/assetLoader';
import type { GameConfig } from '@types/game';
import { gameConfigs } from '@config/games';
import { useGameStore } from '@store/gameStore';
import { GameService } from '@services/GameService';
import '@styles/game.css';

// Component implementation...

/**
 * Index Page - Virtual Chameleon Pet Game
 * Main entry point that renders either the welcome screen or game dashboard
 * 
 * FBLA Introduction to Programming 2025
 * Topic: Build a Virtual Pet with Cost of Care System
 */

import { useGameState } from '@/hooks/useGameState';
import { WelcomeScreen } from '@/components/pet/WelcomeScreen';
import { GameDashboard } from '@/components/pet/GameDashboard';

const Index = () => {
  const {
    gameState,
    initializePet,
    performAction,
    earnMoney,
    performVetService,
    teachTrick,
    setTemperature,
    resetGame,
  } = useGameState();

  // Show welcome screen if no pet has been created
  if (gameState.isFirstTime || !gameState.pet.name) {
    return <WelcomeScreen onStart={initializePet} />;
  }

  // Show main game dashboard
  return (
    <GameDashboard
      gameState={gameState}
      onAction={performAction}
      onEarnMoney={earnMoney}
      onVetService={performVetService}
      onTeachTrick={teachTrick}
      onSetTemperature={setTemperature}
      onReset={resetGame}
    />
  );
};

export default Index;

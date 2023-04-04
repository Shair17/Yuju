import React, {useState, useRef} from 'react';
import {TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../Root';
import {Div, Text, Image} from 'react-native-magnus';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';
import {
  miniGameImages,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  MAX_HEIGHT,
  MAX_WIDTH,
} from '@yuju/mods/minigame/constants/minigame';
import {useMinigameStore} from '@yuju/mods/minigame/stores/useMinigameStore';
import {useBackHandler} from '@yuju/global-hooks/useBackHandler';
import {useDimensions} from '@yuju/global-hooks/useDimensions';
import Physics, {resetPipes} from '@yuju/mods/minigame/components/Physics';
import {Floor} from '@yuju/mods/minigame/components/Floor';
import {Bird} from '@yuju/mods/minigame/components/Bird';
import {minigameStyles} from '@yuju/styles/minigame.styles';

interface Props
  extends NativeStackScreenProps<RootStackParams, 'MinigameScreen'> {}

export const MinigameScreen: React.FC<Props> = ({navigation}) => {
  useBackHandler(() => keepMinigame);

  const [running, setRunning] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const gameEngineRef = useRef<GameEngine>();
  const maxScore = useMinigameStore(m => m.maxScore);
  const setMiniGameMaxScore = useMinigameStore(m => m.setMiniGameMaxScore);
  const setKeepMinigame = useMinigameStore(m => m.setKeepMinigame);
  const keepMinigame = useMinigameStore(m => m.keep);
  const {
    screen: {width: screenWidth, height: screenHeight},
  } = useDimensions();

  const setupWorld = () => {
    // @ts-ignore
    let engine = Matter.Engine.create({
      enableSleeping: false,
    });

    const world = engine.world;

    engine.gravity.y = 0.0;

    let bird = Matter.Bodies.rectangle(
      MAX_WIDTH / 2,
      MAX_HEIGHT / 2,
      BIRD_WIDTH,
      BIRD_HEIGHT,
    );

    let floor1 = Matter.Bodies.rectangle(
      MAX_WIDTH / 2,
      MAX_HEIGHT - 25,
      MAX_WIDTH + 4,
      50,
      {isStatic: true},
    );

    let floor2 = Matter.Bodies.rectangle(
      MAX_WIDTH + MAX_WIDTH / 2,
      MAX_HEIGHT - 25,
      MAX_WIDTH + 4,
      50,
      {isStatic: true},
    );

    Matter.World.add(world, [bird, floor1, floor2]);
    Matter.Events.on(engine, 'collisionStart', event => {
      var pairs = event.pairs;

      // @ts-ignore
      gameEngineRef?.current.dispatch({type: 'game-over'});
    });

    return {
      physics: {engine, world},
      floor1: {body: floor1, renderer: Floor},
      floor2: {body: floor2, renderer: Floor},
      bird: {body: bird, pose: 1, renderer: Bird},
    };
  };

  const entities = setupWorld();

  const onEvent = (e: any) => {
    if (e.type === 'game-over') {
      setRunning(false);
    } else if (e.type === 'score') {
      setScore(score + 1);
    }
  };

  const reset = () => {
    if (score > maxScore) {
      setMiniGameMaxScore(score);
    }
    resetPipes();
    // @ts-ignore
    gameEngineRef.current.swap(setupWorld());
    setRunning(true);
    setScore(0);
  };

  return (
    <Div flex={1}>
      <Image
        position="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        w={screenWidth}
        h={screenHeight}
        source={miniGameImages.background}
        resizeMode="stretch"
      />
      <GameEngine
        ref={el => (gameEngineRef.current = el!)}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
        systems={[Physics]}
        running={running}
        onEvent={onEvent}
        entities={entities}
      />
      <Div position="absolute" top={50} left={MAX_WIDTH / 2 - 20}>
        <Text color="white" fontSize={72} fontWeight="bold">
          {score}
        </Text>
      </Div>
      {!running && (
        <TouchableOpacity style={minigameStyles.container} onPress={reset}>
          <Div
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            alignItems="center"
            justifyContent="center"
            bg="black"
            opacity={0.8}>
            <Text color="white" fontSize={48} fontWeight="bold">
              Fin del Juego
            </Text>
            <Text color="white" fontSize={24}>
              Reintentar
            </Text>
            <Text mt="sm" fontSize="lg" color="white">
              Tu puntaje: {score}
            </Text>
            <Text color="white" mt="md">
              Puntaje máximo: {maxScore}
            </Text>
          </Div>
        </TouchableOpacity>
      )}
    </Div>
  );
};

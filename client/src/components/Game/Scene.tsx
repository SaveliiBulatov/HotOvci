import { Stars, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { createRef, useEffect, useState } from "react";
import { Texture, TextureLoader, Vector3 } from "three";
import Bullet from "../../modules/Game/Bullet";
import Laser from "../../modules/Game/Laser";
import CollidersPosition from "./CollidersPositions";
import Hitscan from "./Hitscan";
import LightMap from "./LightMap";
import Player, { IPlayerProps } from "./Player";
import Projectile from "./Projectile";
import Room from "./Room";
import Zone from "./Zone";
import Robot from "./Robot";

interface ISceneProps {
    playerProps: IPlayerProps;
    cameraProps: {
        vSize: number;
        aspect: number;
    }
}

interface ITextureObject {
    [key: string]: Texture
}

const playerRef = createRef<RapierRigidBody>(); // вынес из зависимостей useEffect

const Scene = (props: ISceneProps) => {
    const textureLoader = new TextureLoader();
    const TPROJECTILE = textureLoader.load('./assets/Bullets/Projectile.png');
    const room = textureLoader.load('./assets/rooms/map-office-plain.png');
    const glass = textureLoader.load('./assets/Map parts/Glass.png');

    const [controlKeys, getKeys] = useKeyboardControls();

    const [textures, setTextures] = useState<ITextureObject>({
        'room': room,
        'bullet': TPROJECTILE,
        'glass': glass,
    });
    const [isMoving, setMoving] = useState<boolean>(false);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [lasers, setLasers] = useState<Laser[]>([]);

    const colliders = CollidersPosition();

    const { viewport, camera, pointer } = useThree();

    useEffect(() => {
        const interval = setInterval(() => {
            playerRef.current?.resetForces(true);
            // console.log(position);
            const { up, down, left, right } = getKeys();
            // if (hp > 0) {
            const force = new Vector3();

            if (left) {
                force.x -= 1;
            }
            if (right) {
                force.x += 1;
            }
            if (up) {
                force.y += 1;
            }
            if (down) {
                force.y -= 1;
            }
            const velocity = vec3(playerRef.current?.linvel());
            const len = velocity.length();
            if (len < 1) {
                force.setLength(1);
            } else {
                force.setLength(1 / len);
            }


            playerRef.current?.addForce(force, true);

        }, 50);

        return () => {
            clearInterval(interval);
        }

    }, [getKeys, pointer, viewport.aspect]);

    useFrame((delta) => {
        const playerPosition = vec3(playerRef.current?.translation());
        camera.position.set(playerPosition.x, playerPosition.y, 7);
        camera.updateProjectionMatrix();
        const velocity = vec3(playerRef.current?.linvel())
        if (velocity.length() === 0) {
            setMoving(false)
        } else {
            setMoving(true)
        }

        const { shoot, hitscan } = getKeys();

        if (shoot) {
            const direction = new Vector3(pointer.x, pointer.y / viewport.aspect, 0);
            const position = vec3(playerRef.current?.translation());
            direction.setLength(0.6);
            position.x += direction.x;
            position.y += direction.y;
            position.z = 0;
            direction.setLength(1);
            const bullet = new Bullet(
                30,
                position,
                direction,
                `${props.playerProps.id}-${Date.now()}`
            );
            setBullets((bullets) => [...bullets, bullet]);
        }
        if (hitscan) {
            const position = vec3(playerRef.current?.translation());
            const aimingPoint = new Vector3(pointer.x, pointer.y / viewport.aspect, 0);
            aimingPoint.setLength(5);
            aimingPoint.x += position.x;
            aimingPoint.y += position.y;
            const laser = new Laser(
                position,
                aimingPoint,
                `${props.playerProps.id}-${Date.now()}`
            )
            setLasers((lasers) => [...lasers, laser])
        }

        // camera.setViewOffset(vSize, vSize, position.x / viewport.aspect, position.y, vSize * viewport.aspect / 2, vSize * viewport.aspect / 2)
        // camera.updateProjectionMatrix();
    });

    return (
        <group>
            <Physics gravity={[0, 0, 0]} colliders="hull" debug>

                <LightMap />

                <fog />

                <group position={[8, 5, 0]}>
                    <Player ref={playerRef} id={1338} isMoving={isMoving} />
                    <Player />
                    <Robot />
                </group>

                {colliders.map(collider =>
                    <RigidBody
                        type='fixed'
                        userData={{
                            type: "Collider"
                        }}>
                        <CuboidCollider
                            position={collider.position}
                            args={collider.args}
                            key={collider.key}
                        />
                    </RigidBody>
                )}

                {bullets.map(bullet =>
                    <Projectile
                        key={bullet.key}
                        initialSpeed={bullet.speed}
                        initialPosition={bullet.position}
                        direction={bullet.direction}
                        texture={textures['bullet']}
                    />
                )}

                {lasers.map(laser =>
                    <Hitscan
                        key={laser.key}
                        initialPosition={[laser.position.x, laser.position.y]}
                        aimingPoint={[laser.aimingPoint.x, laser.aimingPoint.y]}
                    />
                )}

                <group scale={[81, 61, 1]} position={[0, 0, 0]}>
                    <Room texture={textures['room']} />
                </group>

                <Zone position={new Vector3(5.5, 7.5, 0.5)}/>
            </Physics>
            <Stars />
        </group>
    );
}

export default Scene;
import MakeSprite from "./MakeSprite";
import { TextureLoader } from "three";
import { Vector3, SpriteMaterial, Sprite, Mesh } from "three";
import { useRef } from "react";

interface IPRobotStats {
    position?: Vector3;
}

const Robot = (props: IPRobotStats) => {

    const healthbarRef = useRef<Sprite>(null!);
    const robotRef = useRef<Mesh>(null!);

    const textureLoader = new TextureLoader();
    const TRobotTexture = textureLoader.load('client/public/assets/Skins/Robot.png');

    return (
        <mesh ref={robotRef} scale={0.5} position={props.position} >

            <group position={new Vector3(-2, 1, 0.1)} scale={new Vector3(1, 0.25, 0)}>
                <sprite material={new SpriteMaterial({ color: 0x0000FF, })} ref={healthbarRef} />
            </group>
            <MakeSprite texture={TRobotTexture} position={new Vector3(-2, 0, 0.1)} isSphere={true}/>
        </mesh>
    );
}

export default Robot;
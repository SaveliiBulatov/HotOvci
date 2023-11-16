import { ReactThreeFiber, extend } from '@react-three/fiber';
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { Line } from "three/src/objects/Line";
extend({ Line_: Line })

declare global {
	namespace JSX {
		interface IntrinsicElements {
			line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
		}
	}
}

interface IHitscanProps {
	initialPosition: number[];
	aimingPoint: number[]
}

const Hitscan = ({ initialPosition, aimingPoint }: IHitscanProps) => {
	const laserRef = useRef<Line>(null!);
	useEffect(() => {
		laserRef.current.geometry.setFromPoints([initialPosition, aimingPoint].map((point) => new Vector3(...point)));
	}, [initialPosition, aimingPoint]);

	return (
			<line_ ref={laserRef}>
				<lineBasicMaterial color={0x0000ff} />
			</line_>
	)
}

export default Hitscan;
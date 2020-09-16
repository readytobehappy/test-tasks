import "./Waiter.css";
import React from "react";

/** Свойства компонента Waiter */
export interface WaiterProps {
    text?: string;
    /** Размер (диаметр) иконы */
    size?: number;
}

/** Индикатор загрузки */
export default class Waiter extends React.Component<WaiterProps, unknown>
{
    /** Выполняет рендеринг */
    public render(): JSX.Element {
        const { size, text } = this.props;
        const width = size || 32;
        const hw = width / 2;
        const centerRadius = hw * 0.3;
        const orbitRadius = hw * 0.75;
        const planetRadius = hw * 0.2;
        const dp = orbitRadius - planetRadius;
        const planetKeyFrames = `@keyframes planet-rotation {
    0% { transform: rotate(0deg) translate(${dp}px,${dp}px); } 
    100% { transform: rotate(360deg) translate(${dp}px,${dp}px); };
}`;

        return (
            <div className="waiter">
                <div className="text">{text}</div>
                <div>
                    <svg
                        className="waiter"
                        width={width}
                        height={width}
                    >
                        <circle
                            stroke="transparent"
                            fill="#000000"
                            cx={hw}
                            cy={hw}
                            r={centerRadius}
                        />
                        <circle
                            stroke="#ffffff"
                            strokeWidth={0.3}
                            strokeDasharray={2}
                            fill="transparent"
                            cx={hw}
                            cy={hw}
                            r={orbitRadius}
                        />
                        <style>{planetKeyFrames}</style>
                        <circle className="planet"
                            stroke="transparent"
                            fill="#ffffff"
                            cx={hw}
                            cy={hw}
                            r={planetRadius}
                            />
                    </svg>
                </div>
            </div>
        );
    }
}
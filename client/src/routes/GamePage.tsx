import { useState, useEffect } from "react";
import Game from "../components/Game/Game";
import NavButton from "../components/navButton";
import Chat from "../components/Chat/Chat";
import "../popUpMenu.css"

const GamePage = () => {
    const KEY_ESC = 27;
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.keyCode === KEY_ESC) {
          if (isPopupVisible) {
            setIsPopupVisible(false);
          } else {
            setIsPopupVisible(true);
          }
        }
      };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    });
    const openPopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };
    return (
        <div>
            <Chat />
            <Game />
            <button onClick={openPopup} className="openPopupBtn">
                Esc
            </button>
            {isPopupVisible && (
                <div className="popUpMenu" onClick={() => setIsPopupVisible(false)}>
                    <div className="popUpMenu__content" onClick={(e => e.stopPropagation())}>
                        <button onClick={() => setIsPopupVisible(false)} className="popUpBtn">Возобновить</button>
                        <NavButton to="/game" text="Настройки" className="popUpBtn" />
                        <NavButton to="/main" text="Выход" className="popUpBtn" />
                    </div>
                </div>
            )}


        </div>
    );
}

export default GamePage;
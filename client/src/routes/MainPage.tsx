import {useContext, useEffect, useState} from "react";
import {ServerContext, StoreContext} from "../App";
import {useNavigate} from "react-router-dom";
import { TPlayerScore } from "../modules/Server/types";
import useKeyHandler from "../hooks/useKeyHandler";
import Loading from "../components/loading";
import useAuth from "../hooks/useAuth";
import "../Main.css";
import "./StaticPage.css"

const MainPage = () => {

    const server = useContext(ServerContext);
    const store = useContext(StoreContext);
    const [isScorePressed,setIsScorePressed]=useState<boolean>(false);
    const [playerStats, setPlayerStats] = useState<TPlayerScore[] | null>(null);
    const navigate = useNavigate();

    const checkUser = () => {
        if (store.isAuth()) {
            navigate('/game');
        }
    }

    const updateScore = async () => {

        
        const statsFromServer = await server.getStats();
        if (statsFromServer) {
            setPlayerStats(statsFromServer);
        } else {
            if (server.error.code = 1002) {
                navigate("/login", {replace: true})
            }
        }
    }

    useEffect(() => {
        if (isScorePressed) {
            updateScore();
        }
    }, [isScorePressed]);

    const {
        isLoading,
    } = useAuth()

    useKeyHandler(13, checkUser);

    console.log(playerStats)

    return (
        <>
            {isLoading && <Loading/>}
            <div className="slide-in">
            </div>
            <div className="b-marquee b-marquee--rtl">
                <div className="b-marquee__text">Петька спрашивает у Чапаева: «Василий Иванович, а что такое нюанс?»
                    Чапаев: — Снимай штаны Петька, покажу. Петька немного недоумевет, но снимает штаны. Чапаев подходит
                    сзади и засовывает ему понятно что, понятно куда, и объясняет: — Вот смотри Петька. Вроде и у тебя
                    х@й в жопе и у меня х@й в жопе… Но! Есть один нюанс…
                </div>
            </div>
            {isScorePressed && playerStats && (
                <div className="pageWrapper">
                    <div className="pageTitle">Статистика игрока</div>
                        {Object.values(playerStats).map((player: TPlayerScore) => (
                            <div className="container">
                                <div className="static">
                                    <div>
                                        всего игр
                                        <div className="info">Loading..</div>
                                    </div>
                                    <div>
                                        победы
                                        <div className="info">Loading..</div>
                                    </div>
                                    <div>
                                        поражения
                                        <div className="info">Loading..</div>
                                    </div>
                                </div>

                                <div className="damage">
                                    урон за все время
                                    <div>
                                        <div className="info-ace">Loading..</div>
                                        <div className="info-row">
                                            <div>
                                                наивысший
                                                <div className="info">Loading..</div>
                                            </div>
                                            <div>
                                                средний
                                                <div className="info">Loading..</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="kill">
                                    убийств за все время
                                    <div>
                                        <div className="info-ace">{player?.kills || "Loading"} || Loading..</div>
                                        <div className="info-row">
                                            <div>
                                                смертей
                                                <div className="info">{player?.deaths} || Loading</div>
                                            </div>
                                            <div>
                                                k/d
                                                <div className="info">{player?.kills / player?.deaths} || Loading..</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            )
            }
            <h2>КИБОРГИ 2D</h2>
            <div className="Main">
                <button onClick={() => {
                    if(store.isAuth())
                    {
                        navigate('/game')
                    }
                    else
                        navigate('/login')
                }}>
                    Играть
                </button>
                <button onClick={() => 
                    setIsScorePressed(true)
                }>
                    Статистика
                </button>
                <button className="Leave" onClick={() => {
                    server.logout();
                    navigate('/login', {replace: true});
                }}>Выход
                </button>
            </div>
        </>
    );
};

export default MainPage;


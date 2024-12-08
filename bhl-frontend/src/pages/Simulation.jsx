import React, {useEffect, useState} from "react";
import "../style.css";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useDispatch, useSelector} from "react-redux";
import {fetchWebsocket} from "../state/slices/websocketSlice";
import {useParams} from "react-router-dom";
import {Button} from "@mui/material";
import {Navbar} from "../components/Navbar";

function Simulation() {
    const [delay, setDelay] = useState(6); // Opóźnienie w sekundach
    const [unit, setUnit] = useState("s"); // Jednostka
    const [earthMessages, setEarthMessages] = useState([]);
    const [marsMessages, setMarsMessages] = useState([]);
    const [input, setInput] = useState("");
    const [responses, setResponses] = useState([]); // Potencjalne odpowiedzi
    const [selectedResponses, setSelectedResponses] = useState(''); // Wybrane odpowiedzi
    const [signature, setSignature] = useState(""); // Podpis użytkownika
    const [messagesToAnimate, setMessagesToAnimate] = useState([]);

    const dispatch = useDispatch();
    const params = useParams();
    const user = params.user;
    const websocketUrl = useSelector(state => state.websocket.websocketUrl);

    useEffect(() => {
        dispatch(fetchWebsocket({userId: user}));
    }, []);

    const [progress, setProgress] = useState(0);


    const {sendJsonMessage, lastJsonMessage, readyState} = useWebSocket(
        websocketUrl,
        {
            share: false,
            shouldReconnect: (closeEvent) => true,
        },
    );

    useEffect(() => {
        console.log("Connection state changed")
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({
                event: "subscribe",
                data: {
                    channel: "general-chatroom",
                },
            })
        }
    }, [readyState])

    // Run when a new WebSocket message is received (lastJsonMessage)
    useEffect(() => {
        if (lastJsonMessage !== undefined && lastJsonMessage !== null) {
            user === 'EARTH' ? setMarsMessages((prev) => [...prev, JSON.parse(lastJsonMessage)?.text])
                :
                setEarthMessages((prev) => [...prev, JSON.parse(lastJsonMessage)?.text]);
        }
    }, [lastJsonMessage])


    const calculateDelayInMilliseconds = () => {
        switch (unit) {
            case "m":
                return delay * 60 * 1000;
            case "h":
                return delay * 60 * 60 * 1000;
            case "d":
                return delay * 24 * 60 * 60 * 1000;
            default:
                return delay * 1000; // Default to seconds
        }
    };

    const sendMessage = () => {
        if (input.trim()) {
            const message = {text: input, isPredicted: false};
            //   setEarthMessages((prev) => [...prev, message]);
            sendJsonMessage(message);
            // Proponowane odpowiedzi (dodawane od razu)
            const newResponses = [
                `Odpowiedź na "${message.text}" - opcja 1`,
                `Odpowiedź na "${message.text}" - opcja 2`,
                `Odpowiedź na "${message.text}" - opcja 3`,
            ];
            setResponses(newResponses);

            // Dodaj wiadomość do animacji
            const delayInMilliseconds = calculateDelayInMilliseconds();
            setMessagesToAnimate(prev => [...prev, {text: message.text, key: message.key, delay: delayInMilliseconds}]);

            // Dodaj wiadomość na Marsa po opóźnieniu
            setTimeout(() => {
                user === 'MARS' ? setEarthMessages((prev) => [...prev, message]) : setMarsMessages((prev) => [...prev, message]);
            }, delayInMilliseconds);

            setInput(""); // Wyczyść pole tekstowe
        }
    };

    const handleSelectResponse = (response) => {
        setSelectedResponses(response)
    }


    const handleClose = () => {
        setResponses([]);
    };

    const handleAnimationEnd = (key) => {
        setMessagesToAnimate(prev => prev.filter(msg => msg.key !== key));
    };


    const handleSave = () => {
        if (selectedResponses.length > 0 && signature.trim()) {
            const message = {text: input, isPredicted: true};
            sendJsonMessage(message);
            const delayInMilliseconds = calculateDelayInMilliseconds();
            setMessagesToAnimate(prev => [...prev, {text: message.text, key: message.key, delay: delayInMilliseconds}]);
            // Tutaj możesz wysłać dane do backendu
            //   sendOptionalMessage(index, `${selectedResponse} - ${signature}`);

            setSelectedResponses(''); // Wyczyść wybór
            setSignature(""); // Wyczyść podpis

        } else if (!selectedResponses.length) {
            alert("No answer selected! Please select one first!");
        } else {
            alert("No text provided! Please provide one first!");
        }
    };

    return (
        <body class="bg-gray-700">
        <Navbar/>
        <div class="flex min-h-screen w-full">
            <div class="w-64 bg-gray-800 text-white flex flex-col mt-16">
                <div class="p-5 text-xl font-medium border-b border-gray-600">Latency</div>
                {/* Kontrolka opóźnienia */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mb-6">

                    <div className="flex items-center space-x-1">
                        <span className="text-gray-300 font-medium text-lg">{delay}</span>
                        <span className="text-gray-400 text-sm">{unit}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={delay}
                        onChange={(e) => setDelay(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                    <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="mt-4 bg-gray-700 text-gray-300 p-2 rounded-lg focus:outline-none"
                    >
                        <option value="s">Sekundy</option>
                        <option value="m">Minuty</option>
                        <option value="h">Godziny</option>
                        <option value="d">Dni</option>
                    </select>
                </div>
            </div>

            {/* Propozycje odpowiedzi */}
            {/* Obszar symulacji */}
            <div className='flex justify-center items-center w-full mt-32'>
                <div className='w-full max-w-2xl flex flex-col items-center'>
                    {/* Okno Ziemi */}
                    <div
                        className=" flex w-180 bg-gray-800 justify-between space-x-6 rounded-lg shadow-lg w-full">
                        <div className="min-w-80 bg-gray-800 p-4  rounded-lg w-full">
                            <h2 className="text-xl text-center w-full font-semibold items-center mb-4">Earth</h2>
                            {earthMessages.map((msg) => (
                                <div key={msg.key} className="bg-gray-700 p-2 rounded-lg mb-2">
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        {/* Animacja wiadomości */}
                        {/* Okno Marsa */}
                        <div className=" pb-8 min-w-80 bg-gray-800 p-4 rounded-lg shadow-lg w-full">
                            <h2 className="text-xl text-center font-semibold mb-4 w-full">Mars</h2>
                            {marsMessages.map((msg) => (
                                <div key={msg.key} className="bg-gray-700 p-2 border-2 border-orange-600 rounded-lg mb-2">
                                    {msg.text}
                                </div>
                                // <div key={msg.key} className="bg-gray-700 p-2 rounded-lg mb-2">
                                //     {msg.text}
                                // </div>
                            ))}
                        </div>
                    </div>
                    {/* Pole tekstowe i przycisk */}
                    {responses.length > 0 && (
                        <div className="mt-10 bg-gray-800 p-4 rounded-lg shadow-lg mb-6 w-full max-w-2xl">
                            <h3 className="text-lg font-semibold mb-4">Example answers:</h3>
                            {responses.map((response, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectResponse(response)}
                                    className={`p-2 mb-2 cursor-pointer rounded-lg ${selectedResponses.includes(response)
                                        ? "bg-gray-500 text-white"
                                        : "bg-gray-700 text-gray-300"
                                    }`}
                                >
                                    {response}
                                </div>
                            ))}
                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={signature}
                                    onChange={(e) => setSignature(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                    placeholder="Write your own answer"
                                    className="w-full p-2 bg-gray-700 text-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="mt-4 flex w-full justify-between">
                                <Button
                                    onClick={handleSave}
                                    sx={{
                                        mr: '4px',
                                        backgroundColor: '#707484',
                                        border: 1,
                                        borderColor: '#3f3f46',
                                        fontWeight: 'bold',
                                        width: '45%',
                                    }}
                                    color='inherit'
                                >
                                    SEND PREDICTED
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    sx={{
                                        mr: '4px',
                                        backgroundColor: '#707484',
                                        border: 1,
                                        borderColor: '#3f3f46',
                                        fontWeight: 'bold',
                                        width: '45%',
                                    }}
                                    color='inherit'
                                >
                                    Close
                                </Button>
                            </div>
                            {/*<div className="w-full max-w-md mx-auto mt-10">*/}
                            {/*    <div className="relative w-full bg-gray-300 rounded-full h-6">*/}
                            {/*        <div*/}
                            {/*            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"*/}
                            {/*            style={{width: `${progress}%`}}*/}
                            {/*        ></div>*/}
                            {/*    </div>*/}
                            {/*    <p className="text-center mt-2 text-white">{progress}%</p>*/}
                            {/*</div>*/}
                        </div>
                    )}

                    <div className="w-full max-w-md flex items-center m-10 justify-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter your message here..."
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="w-full p-2 bg-gray-800 text-gray-300 rounded-l-lg border-r-0 border-gray-700"
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-gray-500 font-bold text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                        >
                            SEND
                        </button>
                    </div>
                    <div className="space relative flex w-full items-center justify-center">
                        {messagesToAnimate.map((msg) => (
                            <div
                                key={msg.key}
                                className="flying-message absolute bg-gray-700 text-white p-2 rounded-full"
                                style={{animation: `flyToMars ${msg.delay / 1000}s linear`}}
                                onAnimationEnd={() => handleAnimationEnd(msg.key)}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        </body>
    );
}

export default Simulation;

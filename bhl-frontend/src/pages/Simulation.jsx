import React, {useEffect, useState} from "react";
import "../style.css";
import useWebSocket from "react-use-websocket";
import {useDispatch, useSelector} from "react-redux";
import {fetchWebsocket} from "../state/slices/websocketSlice";
import {useParams} from "react-router-dom";
import {Button} from "@mui/material";
import {Navbar} from "../components/Navbar";

function Simulation() {
    const [delay, setDelay] = useState(6); // Delay in seconds
    const [unit, setUnit] = useState("s"); // Unit
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); // Combined chat messages
    const [responses, setResponses] = useState([]); // Potential responses
    const [selectedResponse, setSelectedResponse] = useState(""); // Selected response
    const [signature, setSignature] = useState(""); // User signature

    const dispatch = useDispatch();
    const params = useParams();
    const user = params.user;
    const websocketUrl = useSelector((state) => state.websocket.websocketUrl);

    useEffect(() => {
        dispatch(fetchWebsocket({userId: user}));
    }, []);

    const {sendJsonMessage, lastJsonMessage} = useWebSocket(websocketUrl, {
        share: false,
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            if (lastJsonMessage.is_predicted) {
                setResponses((prev) => [...prev, lastJsonMessage.message]);
            } else {
                setResponses([]);
                setMessages((prev) => [
                    ...prev,
                    {
                        text: lastJsonMessage.message,
                        isFromMars: user === "EARTH",
                    },
                ]);
            }
        }
    }, [lastJsonMessage]);

    const calculateDelayInMilliseconds = () => {
        switch (unit) {
            case "m":
                return delay * 60 * 1000;
            case "h":
                return delay * 60 * 60 * 1000;
            case "d":
                return delay * 24 * 60 * 60 * 1000;
            default:
                return delay * 1000;
        }
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const delayInMilliseconds = calculateDelayInMilliseconds();
            const newMessage = {text: input, isFromMars: user === "MARS"};

            //setMessages((prev) => [...prev, newMessage]);

            await sendJsonMessage({
                message: input,
                is_predicted: false,
            });

            // Simulate delayed message delivery
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {text: input, isFromMars: user === "MARS"},
                ]);
            }, delayInMilliseconds);

            setInput("");
        }
    };

    const handleSave = async () => {
        if (selectedResponse.trim() && signature.trim()) {
            await sendJsonMessage({
                message: `${selectedResponse} - ${signature}`,
                is_predicted: true,
            });
            setSelectedResponse("");
            setSignature("");
        } else {
            alert("Please select a response and provide a signature!");
        }
    };

    return (
        <body className="bg-gray-700">
        <Navbar/>
        <div className="flex flex-col items-center w-full min-h-screen mt-16">
            {/* Chat Section */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-4xl flex flex-col h-96 overflow-hidden">
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-xs p-3 rounded-lg text-white ${
                                msg.isFromMars
                                    ? "bg-blue-500 self-end"
                                    : "bg-gray-500 self-start"
                            }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>
                {/* Input Section */}
                <div className="flex items-center border-t border-gray-600 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-grow p-2 bg-gray-700 text-white rounded-l-lg focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 px-4 py-2 text-white rounded-r-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
            {responses.length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 w-full max-w-4xl">
                    <h3 className="text-lg font-semibold text-white mb-4">
                        Example Responses
                    </h3>
                    <div className="space-y-2">
                        {responses.map((response, index) => (
                            <div
                                key={index}
                                className={`p-2 cursor-pointer rounded-lg ${
                                    selectedResponse === response
                                        ? "bg-gray-600 text-white"
                                        : "bg-gray-700 text-gray-300"
                                }`}
                                onClick={() => setSelectedResponse(response)}
                            >
                                {response}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Enter your signature"
                        className="mt-4 p-2 bg-gray-700 text-white w-full rounded-lg"
                    />
                    <Button
                        onClick={handleSave}
                        className="mt-2 bg-blue-500 text-white w-full hover:bg-blue-700"
                        sx={{
                            mt: 4,
                            backgroundColor: '#3b82f6',
                            color: '#ffffff'
                        }}
                    >
                        Send Predicted
                    </Button>
                </div>
            )}
            {/* Latency Control */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8 w-full max-w-sm text-center">
                <h3 className="text-lg font-semibold text-white">Latency Control</h3>
                <div className="flex items-center justify-center mt-4">
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={delay}
                        onChange={(e) => setDelay(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg cursor-pointer"
                    />
                    <span className="ml-3 text-gray-300">{delay} {unit}</span>
                </div>
                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="mt-4 bg-gray-700 text-white p-2 rounded-lg w-full"
                >
                    <option value="s">Seconds</option>
                    <option value="m">Minutes</option>
                    <option value="h">Hours</option>
                    <option value="d">Days</option>
                </select>
            </div>

            {/* Responses Section */}

        </div>
        </body>
    );
}

export default Simulation;

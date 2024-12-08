import React, { useState } from "react";
import "../style.css";

function Simulation() {
    const [delay, setDelay] = useState(6); // Opóźnienie w sekundach
    const [unit, setUnit] = useState("s"); // Jednostka
    const [earthMessages, setEarthMessages] = useState([]);
    const [marsMessages, setMarsMessages] = useState([]);
    const [input, setInput] = useState("");
    const [responses, setResponses] = useState([]); // Potencjalne odpowiedzi
    const [selectedResponses, setSelectedResponses] = useState([]); // Wybrane odpowiedzi
    const [signature, setSignature] = useState(""); // Podpis użytkownika
    const [messagesToAnimate, setMessagesToAnimate] = useState([]);


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
            const message = { text: input, key: Date.now() };
            //   setEarthMessages((prev) => [...prev, message]);

            // Proponowane odpowiedzi (dodawane od razu)
            const newResponses = [
                `Odpowiedź na "${message.text}" - opcja 1`,
                `Odpowiedź na "${message.text}" - opcja 2`,
                `Odpowiedź na "${message.text}" - opcja 3`,
            ];
            setResponses(newResponses);

            // Dodaj wiadomość do animacji
            const delayInMilliseconds = calculateDelayInMilliseconds();
            setMessagesToAnimate(prev => [...prev, { text: message.text, key: message.key, delay: delayInMilliseconds }]);

            // Dodaj wiadomość na Marsa po opóźnieniu
            setTimeout(() => {
                setMarsMessages((prev) => [...prev, message]);
            }, delayInMilliseconds);

            setInput(""); // Wyczyść pole tekstowe
        }
    };

    const handleSelectResponse = (response) => {
        if (selectedResponses.includes(response)) {
            setSelectedResponses((prev) =>
                prev.filter((r) => r !== response)
            )
        }
        else {
            setSelectedResponses((prev) => [...prev, response]);
        }
    }


    const handleClose = () => {
        setResponses([]);
    };

    const handleAnimationEnd = (key) => {
        setMessagesToAnimate(prev => prev.filter(msg => msg.key !== key));
    };


    const handleSave = () => {
        if (selectedResponses.length > 0 && signature.trim()) {
            const selectedResponse = selectedResponses[0]; // Zakładamy, że wysyłamy tylko jedną odpowiedź
            const index = responses.indexOf(selectedResponse);

            const message = { text: input, key: Date.now() };
            const delayInMilliseconds = calculateDelayInMilliseconds();
            setMessagesToAnimate(prev => [...prev, { text: message.text, key: message.key, delay: delayInMilliseconds }]);
            // Tutaj możesz wysłać dane do backendu
            //   sendOptionalMessage(index, `${selectedResponse} - ${signature}`);

            setSelectedResponses([]); // Wyczyść wybór
            setSignature(""); // Wyczyść podpis

        } else if (!selectedResponses.length) {
            alert("Proszę zaznaczyć odpowiedź, na którą chcesz odpowiedzieć!");
        } else {
            alert("Proszę dodać podpis do odpowiedzi!");
        }
    };

    return ( 
        <body class="bg-gray-100">

            <div class="flex h-screen">
                <div class="w-64 bg-gray-800 text-white flex flex-col">
                    <div class="p-5 text-xl font-medium border-b border-gray-600">Latency</div>
                        {/* Kontrolka opóźnienia */}
                         <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mb-6">
                             <label className="block text-lg font-semibold text-gray-300 mb-4">
                                 Opóźnienie
                             </label>
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

                </div>
                -- Content --
                <div class="flex-1 p-10 text-2xl font-bold">
                    Welcome
                    <p class="text-gray-800 text-base mt-3">
                        This is the main content section of the page. You can add more detailed text here, along with other elements.
                    </p>
                </div>
            </body>
        
        //     <div class="sidebar">
        //             {/* Kontrolka opóźnienia */}
        //         <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center mb-6">
        //             <label className="block text-lg font-semibold text-gray-300 mb-4">
        //                 Opóźnienie
        //             </label>
        //             <div className="flex items-center space-x-1">
        //                 <span className="text-gray-300 font-medium text-lg">{delay}</span>
        //                 <span className="text-gray-400 text-sm">{unit}</span>
        //             </div>
        //             <input
        //                 type="range"
        //                 min="1"
        //                 max="60"
        //                 value={delay}
        //                 onChange={(e) => setDelay(parseInt(e.target.value, 10))}
        //                 className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-blue-500"
        //             />
        //             <select
        //                 value={unit}
        //                 onChange={(e) => setUnit(e.target.value)}
        //                 className="mt-4 bg-gray-700 text-gray-300 p-2 rounded-lg focus:outline-none"
        //             >
        //                 <option value="s">Sekundy</option>
        //                 <option value="m">Minuty</option>
        //                 <option value="h">Godziny</option>
        //                 <option value="d">Dni</option>
        //             </select>
        //         </div>
        //     </div>

        // <div className="simulation-container bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">

        //     {/* Propozycje odpowiedzi */}
        //     {responses.length > 0 && (
        //         <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 w-full max-w-2xl">
        //             <h3 className="text-lg font-semibold mb-4">Propozycje odpowiedzi:</h3>
        //             {responses.map((response, index) => (
        //                 <div
        //                     key={index}
        //                     onClick={() => handleSelectResponse(response)}
        //                     className={`p-2 mb-2 cursor-pointer rounded-lg ${selectedResponses.includes(response)
        //                             ? "bg-blue-500 text-white"
        //                             : "bg-gray-700 text-gray-300"
        //                         }`}
        //                 >
        //                     {response}
        //                 </div>
        //             ))}
        //             <div className="mt-4">
        //                 <input
        //                     type="text"
        //                     value={signature}
        //                     onChange={(e) => setSignature(e.target.value)}
        //                     onKeyDown={(e) => e.key === "Enter" && handleSave()}
        //                     placeholder="Write your own answer"
        //                     className="w-full p-2 bg-gray-700 text-gray-300 rounded-lg"
        //                 />
        //             </div>

        //             <div className="mt-4">
        //                 <button
        //                     onClick={handleSave}
        //                     className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        //                 >
        //                     Save
        //                 </button>

        //                 <button
        //                     onClick={handleClose}
        //                     className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        //                 >
        //                     Close
        //                 </button>
        //             </div>


        //         </div>
        //     )}

        //     {/* Obszar symulacji */}
        //     <div className=" flex flex-wrap	items-center ">
        //         {/* Okno Ziemi */}
        //         <div className=" flex w-full w-180 bg-gray-800 justify-center space-x-6 rounded-lg shadow-lg">

        //             <div className="min-w-80 bg-gray-800 p-4  rounded-lg">
        //                 <h2 className="text-xl font-semibold mb-4">Earth</h2>
        //                 {earthMessages.map((msg) => (
        //                     <div key={msg.key} className="bg-gray-700 p-2 rounded-lg mb-2">
        //                         {msg.text}
        //                     </div>
        //                 ))}
        //             </div>

        //             {/* Animacja wiadomości */}

        //             {/* Okno Marsa */}
        //             <div className=" pb-8 min-w-80 bg-gray-800 p-4 rounded-lg shadow-lg">
        //                 <h2 className="text-xl font-semibold mb-4">Mars</h2>
        //                 {marsMessages.map((msg) => (
        //                     <div key={msg.key} className="bg-gray-700 p-2 border-2 border-orange-600 rounded-lg mb-2">
        //                         {msg.text}
        //                     </div>
        //                 ))}
        //             </div>
        //         </div>

        //         {/* Pole tekstowe i przycisk */}
        //         <div className="w-full max-w-md flex items-center m-10">
        //             <input
        //                 type="text"
        //                 value={input}
        //                 onChange={(e) => setInput(e.target.value)}
        //                 placeholder="Wpisz wiadomość"
        //                 onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        //                 className="w-full p-2 bg-gray-800 text-gray-300 rounded-l-lg border-r-0 border-gray-700"
        //             />
        //             <button
        //                 onClick={sendMessage}
        //                 className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        //             >
        //                 Wyślij
        //             </button>
        //         </div>


        //     </div>



        //     <div className="space relative flex items-center justify-center">
        //         {messagesToAnimate.map((msg) => (
        //             <div
        //                 key={msg.key}
        //                 className="flying-message absolute bg-gray-700 text-white p-2 rounded-full"
        //                 style={{ animation: `flyToMars ${msg.delay / 1000}s linear` }}
        //                 onAnimationEnd={() => handleAnimationEnd(msg.key)}
        //             >
        //                 {msg.text}
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
}

export default Simulation;

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {store} from "./state/store";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/HomePage";
import Simulation from "./pages/Simulation";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>
    },
    {
        path: "/simulation/:user",
        element: <Simulation/>
    }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Provider store={store}>
            <div className='min-h-screen bg-gray-900 text-white font-sans'>
                <RouterProvider router={router}/>
            </div>
        </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

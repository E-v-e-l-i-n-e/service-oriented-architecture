import React from 'react';
import './App.css';
import BandPreview from "./components/BandPreview/BandPreview";
import {MusicGenre} from "./models/MusicGenre";
import BandListTable from './components/BandListTable';
import { ViewModelsProvider } from './context/ViewModelsContext';

function App() {
    const musicBand = {
        id: 1,
        name: "The Beatles",
        genre: MusicGenre.HIP_HOP,
        singleCount: 22,
        numberOfParticipants: 4,
        coordinates: {x: 10, y: 20},
        creationDate: new Date("1960-01-01"),
        albumsCount: 13,
        label: {
            sales: 7,
        }
    };

    const handleCardClick = () => {
        alert(`Вы выбрали группу: ${musicBand.name}`);
    };

    return (
        <ViewModelsProvider>
            <div className="App">
                <BandListTable/>
            </div>
        </ViewModelsProvider>
    );
}

export default App;
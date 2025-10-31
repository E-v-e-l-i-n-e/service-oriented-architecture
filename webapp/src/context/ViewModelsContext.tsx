import { MusicBandViewModel } from '../viewModels/MusicBandViewModel';
import { GrammyViewModel } from '../viewModels/GrammyViewModel';
import React, { createContext, useContext, useMemo, ReactNode } from 'react';


interface ViewModelsContextType {
    musicBandVM: MusicBandViewModel;
    grammyVM: GrammyViewModel;
}


const ViewModelsContext = createContext<ViewModelsContextType | undefined>(undefined);


export const ViewModelsProvider: React.FC<{ children: ReactNode }> = ({ 
    children 
}): JSX.Element => {
    const musicBandVM = useMemo((): MusicBandViewModel => {
        return new MusicBandViewModel();
    }, []);

    const grammyVM = useMemo((): GrammyViewModel => {
        return new GrammyViewModel();
    }, []);

    const value = useMemo(
        (): ViewModelsContextType => ({ musicBandVM, grammyVM }),
        [musicBandVM, grammyVM]
    );

    return (
        <ViewModelsContext.Provider value={value}>
            {children}
        </ViewModelsContext.Provider>
    );
};


export const useViewModels = (): ViewModelsContextType => {
    const context = useContext(ViewModelsContext);
    
    if (context === undefined) {
        throw new Error(
            'useViewModels должен использоваться внутри ViewModelsProvider'
        );
    }
    
    return context;
};

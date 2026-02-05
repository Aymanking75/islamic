
import React, { useState } from 'react';
import Layout from './components/Layout.tsx';
import Landing from './pages/Landing.tsx';
import Library from './pages/Library.tsx';
import Quran from './pages/Quran.tsx';
import Chat from './pages/Chat.tsx';
import ImageLab from './pages/ImageLab.tsx';
import { AppView } from './types.ts';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.LANDING);

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <Landing setView={setView} />;
      case AppView.LIBRARY:
        return <Library setView={setView} />;
      case AppView.QURAN:
        return <Quran />;
      case AppView.CHAT:
        return <Chat />;
      case AppView.IMAGE_GEN:
        return <ImageLab />;
      default:
        return <Landing setView={setView} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;

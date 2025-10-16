import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Groups } from './pages/Groups';
import { GroupDetails } from './pages/GroupDetails';
import { Settlement } from './pages/Settlement';
import { Summary } from './pages/Summary';

type PageType = 'dashboard' | 'groups' | 'group-details' | 'settlement' | 'summary';

interface NavigationState {
  page: PageType;
  data?: any;
}

function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'dashboard',
  });

  const handleNavigate = (page: string, data?: any) => {
    setNavigation({ page: page as PageType, data });
  };

  const renderPage = () => {
    switch (navigation.page) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'groups':
        return <Groups onNavigate={handleNavigate} />;
      case 'group-details':
        return <GroupDetails onNavigate={handleNavigate} groupId={navigation.data?.groupId} />;
      case 'settlement':
        return <Settlement />;
      case 'summary':
        return <Summary />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <Layout currentPage={navigation.page} onNavigate={handleNavigate}>
          {renderPage()}
        </Layout>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

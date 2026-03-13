'use client'
// src/components/pages/AppScreen.tsx
import { useAppStore } from '@/hooks/useAppStore'
import Navbar    from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import MobileTopbar from '@/components/layout/MobileTopbar'
import HomePage     from './HomePage'
import NotesPage    from './NotesPage'
import MediaPage    from './MediaPage'
import LibraryPage  from './LibraryPage'
import PortfolioPage from './PortfolioPage'
import ChatPage     from './ChatPage'

const PAGES = [
  { id: 'home',      C: HomePage      },
  { id: 'notes',     C: NotesPage     },
  { id: 'media',     C: MediaPage     },
  { id: 'library',   C: LibraryPage   },
  { id: 'portfolio', C: PortfolioPage },
  { id: 'chat',      C: ChatPage      },
]

export default function AppScreen() {
  const { activeTab } = useAppStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <MobileTopbar />
      <Navbar />
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {PAGES.map(({ id, C }) => (
          <div key={id} style={{
            display: activeTab === id ? 'flex' : 'none',
            height: '100%', flexDirection: 'column', overflow: 'hidden',
          }}>
            <C />
          </div>
        ))}
      </main>
      <BottomNav />
    </div>
  )
}

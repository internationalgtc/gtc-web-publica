import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-cream text-ink">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

import { Outlet } from 'react-router-dom'
import TopNav from '../../../components/TopNav'

export default function FullWidthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-20">
      <TopNav />
      <main className="flex-1 flex flex-col">
        <div className="w-full mx-auto flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import TopNav from '../../../components/TopNav'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-20">
      <TopNav />
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-[1600px] mx-auto lg:px-0 px-4 flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

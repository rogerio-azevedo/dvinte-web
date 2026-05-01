import { Outlet } from 'react-router-dom'

/** Layout só para jogar em celular — sem TopNav, altura viewport. */
export default function PlayMobileLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#1a1a2e]">
      <Outlet />
    </div>
  )
}

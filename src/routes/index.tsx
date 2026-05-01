import { Routes, Route } from 'react-router-dom'
import DefaultLayout from '../pages/_Layouts/default'
import FullWidthLayout from '../pages/_Layouts/fullwidth'
import PlayMobileLayout from '../pages/_Layouts/playmobile'
import AuthLayout from '../pages/_Layouts/auth'
import { RequireAuth, PublicOnly } from './guards'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import Dashboard from '../pages/Dashboard'
import Alignment from '../pages/Alignment'
import Classe from '../pages/Classe'
import Divinity from '../pages/Divinity'
import Race from '../pages/Race'
import Portrait from '../pages/Portrait'
import Token from '../pages/Token'
import Weapon from '../pages/Weapon'
import Armor from '../pages/Armor'
import Character from '../pages/Character'
import CharacterDetail from '../pages/CharacterDetail'
import CharacterCreate from '../pages/CharacterCreate'
import CharacterToken from '../pages/CharacterToken'
import Monster from '../pages/Monster'
import MonsterDetail from '../pages/MonsterDetail'
import MonsterCreate from '../pages/MonsterCreate'
import Campaign from '../pages/Campaign'
import Notes from '../pages/Notes'
import GmTools from '../pages/GmTools'
import WorldMap from '../pages/WorldMap'
import Combat from '../pages/Combat'
import CharBase from '../pages/CharacterCreate/CharBase'
import CharClass from '../pages/CharacterCreate/CharClass'
import CharAttributes from '../pages/CharacterCreate/CharAttributes'
import CharPreview from '../pages/CharacterCreate/CharPreview'
import Equipment from '../pages/Equipment'
import Play from '../pages/Play'
import PlayMobile from '../pages/PlayMobile'
import MyDices from '../components/CombatComponents/MyDices'
import AssetsPage from '../pages/Assets'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas públicas (login, cadastro) */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicOnly />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
        </Route>
      </Route>

      {/* Rotas privadas (usuário autenticado) */}
      <Route element={<DefaultLayout />}>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/alignments" element={<Alignment />} />
          <Route path="/classes" element={<Classe />} />
          <Route path="/divinities" element={<Divinity />} />
          <Route path="/races" element={<Race />} />
          <Route path="/weapons" element={<Weapon />} />
          <Route path="/armors" element={<Armor />} />
          <Route path="/equipments" element={<Equipment />} />
          <Route path="/portraits" element={<Portrait />} />
          <Route path="/tokens" element={<Token />} />
          <Route path="/characters" element={<Character />} />
          <Route path="/characterview/:id" element={<CharacterDetail />} />
          <Route path="/charactercreate" element={<CharacterCreate />} />
          <Route path="/charactertoken" element={<CharacterToken />} />
          <Route path="/monsters" element={<Monster />} />
          <Route path="/monsterview/:id" element={<MonsterDetail />} />
          <Route path="/monstercreate" element={<MonsterCreate />} />
          <Route path="/campaigns" element={<Campaign />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/gmtools" element={<GmTools />} />
          <Route path="/charbase" element={<CharBase />} />
          <Route path="/charclass" element={<CharClass />} />
          <Route path="/charattributes" element={<CharAttributes />} />
          <Route path="/charpreview" element={<CharPreview />} />
          <Route path="/mydices" element={<MyDices />} />
          <Route path="/assets" element={<AssetsPage />} />
        </Route>
      </Route>

      <Route element={<PlayMobileLayout />}>
        <Route element={<RequireAuth />}>
          <Route path="/playmobile" element={<PlayMobile />} />
        </Route>
      </Route>

      {/* Rotas FullWidth (usuário autenticado, páginas de jogo) */}
      <Route element={<FullWidthLayout />}>
        <Route element={<RequireAuth />}>
          <Route path="/map" element={<WorldMap />} />
          <Route path="/combat" element={<Combat />} />
          <Route path="/play" element={<Play />} />
        </Route>
      </Route>
    </Routes>
  )
}

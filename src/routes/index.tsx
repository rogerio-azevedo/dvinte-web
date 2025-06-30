import React from 'react'
import { Routes, Route } from 'react-router'
import { createProtectedComponent } from './Route'

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

import Dices from '../components/Dices'
import Play from '../pages/Play'
import MyDices from '../components/CombatComponents/MyDices'

// Criando componentes protegidos
const ProtectedSignIn = createProtectedComponent(SignIn, false)
const ProtectedSignUp = createProtectedComponent(SignUp, false)
const ProtectedProfile = createProtectedComponent(Profile, true)
const ProtectedDashboard = createProtectedComponent(Dashboard, true)
const ProtectedDices = createProtectedComponent(Dices, true)
const ProtectedAlignment = createProtectedComponent(Alignment, true)
const ProtectedClasse = createProtectedComponent(Classe, true)
const ProtectedDivinity = createProtectedComponent(Divinity, true)
const ProtectedRace = createProtectedComponent(Race, true)
const ProtectedWeapon = createProtectedComponent(Weapon, true)
const ProtectedArmor = createProtectedComponent(Armor, true)
const ProtectedEquipment = createProtectedComponent(Equipment, true)
const ProtectedPortrait = createProtectedComponent(Portrait, true)
const ProtectedToken = createProtectedComponent(Token, true)
const ProtectedCharacter = createProtectedComponent(Character, true)
const ProtectedCharacterDetail = createProtectedComponent(CharacterDetail, true)
const ProtectedCharacterCreate = createProtectedComponent(CharacterCreate, true)
const ProtectedCharacterToken = createProtectedComponent(CharacterToken, true)
const ProtectedMonster = createProtectedComponent(Monster, true)
const ProtectedMonsterDetail = createProtectedComponent(MonsterDetail, true)
const ProtectedMonsterCreate = createProtectedComponent(MonsterCreate, true)
const ProtectedCampaign = createProtectedComponent(Campaign, true)
const ProtectedNotes = createProtectedComponent(Notes, true)
const ProtectedGmTools = createProtectedComponent(GmTools, true)
const ProtectedWorldMap = createProtectedComponent(WorldMap, true)
const ProtectedCombat = createProtectedComponent(Combat, true)
const ProtectedPlay = createProtectedComponent(Play, true)
const ProtectedCharBase = createProtectedComponent(CharBase, true)
const ProtectedCharClass = createProtectedComponent(CharClass, true)
const ProtectedCharAttributes = createProtectedComponent(CharAttributes, true)
const ProtectedCharPreview = createProtectedComponent(CharPreview, true)
const ProtectedMyDices = createProtectedComponent(MyDices, true)

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedSignIn />} />
      <Route path="/register" element={<ProtectedSignUp />} />
      <Route path="/profile" element={<ProtectedProfile />} />
      <Route path="/dashboard" element={<ProtectedDashboard />} />
      <Route path="/dices" element={<ProtectedDices />} />
      <Route path="/alignments" element={<ProtectedAlignment />} />
      <Route path="/classes" element={<ProtectedClasse />} />
      <Route path="/divinities" element={<ProtectedDivinity />} />
      <Route path="/races" element={<ProtectedRace />} />
      <Route path="/weapons" element={<ProtectedWeapon />} />
      <Route path="/armors" element={<ProtectedArmor />} />
      <Route path="/equipments" element={<ProtectedEquipment />} />
      <Route path="/portraits" element={<ProtectedPortrait />} />
      <Route path="/tokens" element={<ProtectedToken />} />
      <Route path="/characters" element={<ProtectedCharacter />} />
      <Route path="/characterview/:id" element={<ProtectedCharacterDetail />} />
      <Route path="/charactercreate" element={<ProtectedCharacterCreate />} />
      <Route path="/charactertoken" element={<ProtectedCharacterToken />} />
      <Route path="/monsters" element={<ProtectedMonster />} />
      <Route path="/monsterview/:id" element={<ProtectedMonsterDetail />} />
      <Route path="/monstercreate" element={<ProtectedMonsterCreate />} />
      <Route path="/campaigns" element={<ProtectedCampaign />} />
      <Route path="/notes" element={<ProtectedNotes />} />
      <Route path="/gmtools" element={<ProtectedGmTools />} />
      <Route path="/map" element={<ProtectedWorldMap />} />
      <Route path="/combat" element={<ProtectedCombat />} />
      <Route path="/play" element={<ProtectedPlay />} />
      <Route path="/charbase" element={<ProtectedCharBase />} />
      <Route path="/charclass" element={<ProtectedCharClass />} />
      <Route path="/charattributes" element={<ProtectedCharAttributes />} />
      <Route path="/charpreview" element={<ProtectedCharPreview />} />
      <Route path="/mydices" element={<ProtectedMyDices />} />
    </Routes>
  )
}

export default RoutesComponent

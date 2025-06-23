import React from 'react'
import { Switch } from 'react-router-dom'
import Route from './Route'

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

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/register" component={SignUp} />
      <Route path="/profile" component={Profile} isPrivate />

      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/dices" component={Dices} isPrivate />

      <Route path="/alignments" component={Alignment} isPrivate />
      <Route path="/classes" component={Classe} isPrivate />
      <Route path="/divinities" component={Divinity} isPrivate />
      <Route path="/races" component={Race} isPrivate />
      <Route path="/weapons" component={Weapon} isPrivate />
      <Route path="/armors" component={Armor} isPrivate />
      <Route path="/equipments" component={Equipment} isPrivate />

      <Route path="/portraits" component={Portrait} isPrivate />
      <Route path="/tokens" component={Token} isPrivate />

      <Route path="/characters" component={Character} isPrivate />
      <Route path="/characterview/:id" component={CharacterDetail} isPrivate />
      <Route path="/charactercreate" component={CharacterCreate} isPrivate />
      <Route path="/charactertoken" component={CharacterToken} isPrivate />

      <Route path="/monsters" component={Monster} isPrivate />
      <Route path="/monsterview/:id" component={MonsterDetail} isPrivate />
      <Route path="/monstercreate" component={MonsterCreate} isPrivate />

      <Route path="/campaigns" component={Campaign} isPrivate />

      <Route path="/notes" component={Notes} isPrivate />
      <Route path="/gmtools" component={GmTools} isPrivate />
      <Route path="/map" component={WorldMap} isPrivate />
      <Route path="/combat" component={Combat} isPrivate />
      <Route path="/play" component={Play} isPrivate />

      <Route path="/charbase" component={CharBase} isPrivate />
      <Route path="/charclass" component={CharClass} isPrivate />
      <Route path="/charattributes" component={CharAttributes} isPrivate />
      <Route path="/charpreview" component={CharPreview} isPrivate />

      <Route path="/mydices" component={MyDices} isPrivate />
    </Switch>
  )
}

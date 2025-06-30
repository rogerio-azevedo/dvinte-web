# Documento de Atualização: React Router v5 → v7

## 📋 Análise do Estado Atual

### Versões Atuais

- **React Router DOM**: `^5.1.2`
- **React**: `18`
- **Redux**: Integrado com sagas
- **History**: `^4.10.1`

### Mapeamento de Dependências Encontradas

#### 1. Importações do React Router v5

```typescript
// Componentes principais
import { Switch, Router, Route, Redirect, Link } from 'react-router-dom'

// Hooks
import { useHistory, useLocation, useParams } from 'react-router-dom'

// Tipos TypeScript
import { RouteProps, RouteComponentProps } from 'react-router-dom'
```

#### 2. Arquivos que Usam React Router

**Configuração Principal:**

- `src/App.tsx` - Router principal
- `src/routes/index.tsx` - Definição de rotas
- `src/routes/Route.tsx` - Componente Route customizado
- `src/services/history.ts` - Configuração do history

**Componentes que usam Navegação:**

- `src/components/ButtonNext/index.tsx` - useHistory
- `src/components/ButtonPrev/index.tsx` - Link
- `src/components/Header/index.tsx` - Link
- `src/components/TopNav/index.js` - Link

**Páginas que usam Hooks:**

- `src/pages/CharacterDetail/index.tsx` - useParams
- `src/pages/MonsterDetail/index.tsx` - useParams
- `src/pages/CharacterCreate/index.tsx` - useLocation
- `src/pages/CharacterCreate/CharPreview/index.tsx` - history.push (importado)

**Redux Sagas:**

- `src/store/modules/auth/sagas.js` - history.push
- `src/store/modules/character/sagas.js` - history.push

### 3. Padrões de Uso Identificados

#### Navegação Programática

```javascript
// Em sagas
history.push('/dashboard')
history.push('/characters')
history.push('/')

// Em componentes
const history = useHistory()
history.push(linkto)
```

#### Parâmetros de Rota

```typescript
const { id } = useParams<RouteParams>()
```

#### Localização

```typescript
const location = useLocation()
```

#### Redirecionamentos

```typescript
<Redirect to="/" />
<Redirect to="/dashboard" />
```

#### Route Customizada com Autenticação

```typescript
<Route path="/" exact component={SignIn} />
<Route path="/dashboard" component={Dashboard} isPrivate />
```

---

## 🎯 Plano de Atualização Passo a Passo

### Fase 1: Preparação e Dependências

**Objetivo**: Atualizar dependências e preparar ambiente

#### 1.1 Atualizar package.json

```json
{
  "dependencies": {
    "react-router": "^7.0.0", // Novo pacote unificado
    "history": "^5.3.0" // Atualizar para compatibilidade
  },
  "devDependencies": {
    "@types/react-router-dom": "remover" // Não mais necessário
  }
}
```

#### 1.2 Instalar dependências

```bash
yarn remove react-router-dom @types/react-router-dom
yarn add react-router@^7.0.0
yarn add -D @types/react-router@^5.1.0
```

### Fase 2: Migração de Imports

**Objetivo**: Atualizar todas as importações

#### 2.1 Atualizar imports básicos

```typescript
// ANTES (v5)
import { Switch, Router, Route, Redirect, Link } from 'react-router-dom'
import { useHistory, useLocation, useParams } from 'react-router-dom'

// DEPOIS (v7)
import { Routes, BrowserRouter, Route, Navigate, Link } from 'react-router'
import { useNavigate, useLocation, useParams } from 'react-router'
```

#### 2.2 Mapear mudanças de componentes

| v5           | v7              | Mudança             |
| ------------ | --------------- | ------------------- |
| `Switch`     | `Routes`        | Renomeado           |
| `Router`     | `BrowserRouter` | Específico para web |
| `Redirect`   | `Navigate`      | Renomeado           |
| `useHistory` | `useNavigate`   | API diferente       |

### Fase 3: Migração do Sistema de Rotas

**Objetivo**: Converter estrutura de rotas

#### 3.1 Atualizar App.tsx

```typescript
// ANTES
import { Router } from 'react-router-dom'
import history from './services/history'
;<Router history={history}>
  <Routes />
</Router>

// DEPOIS
import { BrowserRouter } from 'react-router'
;<BrowserRouter>
  <Routes />
</BrowserRouter>
```

#### 3.2 Converter routes/index.tsx

```typescript
// ANTES (v5)
<Switch>
  <Route path="/" exact component={SignIn} />
  <Route path="/dashboard" component={Dashboard} isPrivate />
</Switch>

// DEPOIS (v7)
<Routes>
  <Route path="/" element={<ProtectedRoute component={SignIn} />} />
  <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} isPrivate />} />
</Routes>
```

#### 3.3 Refatorar Route.tsx customizada

```typescript
// NOVO padrão para Route customizada
interface ProtectedRouteProps {
  component: React.ComponentType
  isPrivate?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  isPrivate = false,
}) => {
  const { signed } = useSelector((state: AuthState) => state.auth)
  const navigate = useNavigate()

  if (!signed && isPrivate) {
    return <Navigate to="/" replace />
  }

  if (signed && !isPrivate) {
    return <Navigate to="/dashboard" replace />
  }

  const Layout = signed ? DefaultLayout : AuthLayout

  return (
    <Layout>
      <Component />
    </Layout>
  )
}
```

### Fase 4: Migração de Hooks

**Objetivo**: Converter hooks para nova API

#### 4.1 useHistory → useNavigate

```typescript
// ANTES
const history = useHistory()
history.push('/path')
history.replace('/path')

// DEPOIS
const navigate = useNavigate()
navigate('/path')
navigate('/path', { replace: true })
```

#### 4.2 Atualizar ButtonNext/index.tsx

```typescript
// ANTES
import { useHistory } from 'react-router-dom'
const history = useHistory()
history.push(linkto)

// DEPOIS
import { useNavigate } from 'react-router'
const navigate = useNavigate()
navigate(linkto)
```

### Fase 5: Migração do Redux Integration

**Objetivo**: Remover dependência de history externo

#### 5.1 Atualizar sagas para usar navigate

```javascript
// Opção 1: Passar navigate via payload
export function* signIn({ payload }) {
  // ... lógica de autenticação
  yield put(signInSuccess(token, user))
  // Emitir ação para navegação
  yield put(navigate('/dashboard'))
}

// Opção 2: Usar callback
export function* signIn({ payload }) {
  const { email, password, onSuccess } = payload
  // ... lógica de autenticação
  yield put(signInSuccess(token, user))
  if (onSuccess) onSuccess('/dashboard')
}
```

#### 5.2 Remover history service

```typescript
// Remover src/services/history.ts
// Atualizar imports nos sagas
```

### Fase 6: Migração de Tipos e PropTypes

**Objetivo**: Atualizar tipos TypeScript e remover PropTypes

#### 6.1 Remover tipos React Router v5

```typescript
// Remover
import { RouteProps, RouteComponentProps } from 'react-router-dom'

// Não há equivalente direto no v7 - usar tipos genéricos
```

#### 6.2 Remover/Atualizar PropTypes

**Arquivos com PropTypes encontrados:**

**6.2.1 SelectWeapon (src/components/SelectWeapon/index.tsx)**

```typescript
// REMOVER estas linhas:
import PropTypes from 'prop-types'

SelectWeapon.propTypes = {
  changeWeapon: PropTypes.func.isRequired,
  weapons: PropTypes.arrayOf(PropTypes.object),
}

// JÁ tem interface TypeScript, então PropTypes é redundante
```

**6.2.2 Layout Files (src/pages/\_Layouts/)**

```javascript
// auth/index.js - CONVERTER para TypeScript
import PropTypes from 'prop-types'

AuthLayout.propTypes = {
  children: PropTypes.element.isRequired,
}

// default/index.js - CONVERTER para TypeScript
import PropTypes from 'prop-types'

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
}
```

#### 6.3 Dependências a Remover/Atualizar

```json
// package.json - REMOVER/ATUALIZAR
{
  "dependencies": {
    "prop-types": "^15.7.2", // REMOVER se não usar mais
    "history": "^4.10.1" // ATUALIZAR para ^5.3.0
  },
  "devDependencies": {
    "@types/react-router-dom": "^5.3.3" // REMOVER
  }
}
```

### Fase 7: Testes e Validação

**Objetivo**: Garantir funcionamento correto

#### 7.1 Checklist de Funcionalidades

- [ ] Login/Logout funciona
- [ ] Navegação entre páginas
- [ ] Rotas protegidas
- [ ] Parâmetros de URL
- [ ] Redirecionamentos
- [ ] Navegação programática em sagas
- [ ] Botões de navegação

#### 7.2 Testes Manuais

- [ ] Acesso direto a URLs
- [ ] Navegação por links
- [ ] Botão voltar do navegador
- [ ] Refresh da página

---

## ⚠️ Pontos de Atenção

### Mudanças Críticas

1. **useHistory não existe** - Usar useNavigate
2. **Switch → Routes** - Sintaxe completamente diferente
3. **component → element** - Prop mudou
4. **History externo** - Não mais suportado nativamente
5. **Redirect → Navigate** - Comportamento similar mas API diferente

### Possíveis Problemas

1. **Redux Integration**: Sagas não terão mais acesso direto ao history
2. **Tipos TypeScript**: Alguns tipos foram removidos
3. **Nested Routes**: Sintaxe mudou significativamente
4. **Route Props**: Não há mais props automáticas (match, location, history)

### Soluções Alternativas

1. **Para Sagas**: Usar callbacks ou ações específicas para navegação
2. **Para Tipos**: Usar tipos genéricos do React
3. **Para Props**: Usar hooks dentro dos componentes

---

## 📦 Resumo das Mudanças

### Arquivos a Modificar

1. `package.json` - Dependências e tipos
2. `src/App.tsx` - Router principal
3. `src/routes/index.tsx` - Estrutura de rotas
4. `src/routes/Route.tsx` - Componente customizado
5. `src/components/ButtonNext/index.tsx` - useHistory
6. `src/components/SelectWeapon/index.tsx` - Remover PropTypes
7. `src/pages/CharacterCreate/index.tsx` - useLocation
8. `src/pages/CharacterDetail/index.tsx` - useParams
9. `src/pages/MonsterDetail/index.tsx` - useParams
10. `src/pages/CharacterCreate/CharPreview/index.tsx` - history import
11. `src/pages/_Layouts/auth/index.js` - Converter para TS e remover PropTypes
12. `src/pages/_Layouts/default/index.js` - Converter para TS e remover PropTypes
13. `src/store/modules/auth/sagas.js` - history.push
14. `src/store/modules/character/sagas.js` - history.push

### Arquivos a Remover

1. `src/services/history.ts` - Não mais necessário

### Estimativa de Esforço

- **Tempo estimado**: 2-3 dias
- **Complexidade**: Média-Alta
- **Risco**: Médio (mudanças estruturais)

---

## 🚀 Próximos Passos

1. ✅ **Análise concluída**
2. ⏳ **Aguardando aprovação para iniciar**
3. 📋 **Executar Fase 1: Dependências**
4. 🔄 **Executar Fases 2-6 sequencialmente**
5. ✅ **Validar funcionamento**
6. 📝 **Documentar mudanças**

---

_Documento criado em: Janeiro 2025_
_Versão: 1.0_

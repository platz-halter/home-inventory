import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ItemsPage } from './pages/ItemsPage'
import { ManagePage } from './pages/ManagePage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/items"  element={<ItemsPage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Layout>
  )
}
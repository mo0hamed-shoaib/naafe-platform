
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import './styles/globals.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="naafe-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes here as we build them */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App

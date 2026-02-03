import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <AppRoutes />
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
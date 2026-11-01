import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/ui/Layout'
import { Home } from './pages/Home'
import { LessonOverview, LessonSection } from './pages/Lesson'
import { Quiz } from './pages/Quiz'
import { Concepts } from './pages/Concepts'
import { Notes } from './pages/Notes'
import { Readings } from './pages/Readings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pamoka/:slug" element={<LessonOverview />} />
        <Route path="/pamoka/:slug/pasitikrinimas" element={<Quiz />} />
        <Route path="/pamoka/:slug/:n" element={<LessonSection />} />
        <Route path="/savokos" element={<Concepts />} />
        <Route path="/mintys" element={<Notes />} />
        <Route path="/skaitiniai" element={<Readings />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

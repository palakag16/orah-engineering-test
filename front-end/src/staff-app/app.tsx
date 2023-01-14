import React, { createContext, useState } from "react"
import { Routes, Route } from "react-router-dom"
import "shared/helpers/load-icons"
import { Person, PersonContextType } from "shared/models/person"
import { Header } from "staff-app/components/header/header.component"
import { HomeBoardPage } from "staff-app/daily-care/home-board.page"
import { ActivityPage } from "staff-app/platform/activity.page"

const Students = React.createContext<PersonContextType | null>(null)
function App() {
  const [studentData, setStudentData] = useState<Person[] >([])
  const [backupData, setBackup] = useState<Person[] >([])
  return (
    <>
      <Students.Provider value={{ studentData, setStudentData, backupData, setBackup }}>
        <Header />
        <Routes>
          <Route path="daily-care" element={<HomeBoardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="*" element={<div>No Match</div>} />
        </Routes>
      </Students.Provider>
    </>
  )
}

export default App
export { Students }

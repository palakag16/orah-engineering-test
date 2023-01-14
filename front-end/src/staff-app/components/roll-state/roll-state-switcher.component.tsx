import React, { useState, useContext, useEffect } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Students } from "staff-app/app"
import { PersonContextType } from "shared/models/person"
interface Props {
  initialState?: RolllStateType
  size?: number
  id: number
  onStateChange?: (newState: RolllStateType) => void
  role:string
}
export const RollStateSwitcher: React.FC<Props> = ({ role, id, size = 40, onStateChange }) => {
  const { studentData, setStudentData, setBackup,backupData } = useContext(Students) as PersonContextType
  const [rollState, setRollState] = useState(role)
  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = (id: number) => {
    const next = nextState()
    setRollState(next)
    const Setrole=backupData?.map((el) => {
      if (el.id == id) {
        return { ...el, role: next }
      }
      return el
    })
    setBackup(Setrole);
    setStudentData(Setrole)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={() => onClick(id)} />
}

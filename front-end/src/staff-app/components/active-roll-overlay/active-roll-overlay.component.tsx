import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { Students } from "staff-app/app"
import { PersonContextType } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { useNavigate } from "react-router-dom"
export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}
interface List {
  present: number
  all: number
  late: number
  absent: number
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const navigate=useNavigate();
  const { backupData } = useContext(Students) as PersonContextType
  const [stateData, setStateData] = useState<any>({ present: 0, all: 0, late: 0, absent: 0 })
  const { isActive, onItemClick } = props
  const [saveActiveRoll, data, loadState] = useApi({ url: "save-roll" })

  useEffect(() => {
    let obj: any = { present: 0, all: 0, late: 0, absent: 0 }
    if(backupData){
      for (let i of backupData) {
        if (i.role) {
          const temp = obj[i.role]
          obj[i.role] = temp + 1
        }
      }
    }
    setStateData(obj)
  }, [backupData])
  const convertData=()=>{
    const arr=[]
    if(backupData){
    for(let j of backupData){
       arr.push({student_id:j.id,roll_state:j.role})
    }
    void saveActiveRoll(arr)
    navigate("/staff/activity")
  }
  }
  // student_roll_states: { student_id: number; roll_state: RolllStateType }[]

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: stateData.all },
              { type: "present", count: stateData.present },
              { type: "late", count: stateData.late },
              { type: "absent", count: stateData.absent },
            ]}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={() => {
              onItemClick("exit")
              convertData()
              }}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}

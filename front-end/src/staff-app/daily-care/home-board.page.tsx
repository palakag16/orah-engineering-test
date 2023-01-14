import React, { useState, useEffect, useContext } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonContextType, PersonFull } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { Students } from "staff-app/app"
import Search from "../../assets/images/Search.svg"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
export const HomeBoardPage: React.FC = () => {
  const { studentData, setStudentData, setBackup, backupData } = useContext(Students) as PersonContextType
  const [isRollMode, setIsRollMode] = useState(false)
  const [query, setQuery] = useState<string>("")
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [sortKey, setSortKey] = useState<string>("first_name")
  const [sortorder,setOrder]=useState<string>("")
  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }
  useEffect(() => {
    let output: PersonFull[] = []
    const details: Person[] | undefined = data?.students || []
    for (let i of details) {
      output.push({ ...i, role: "unmark" })
    }
    setStudentData(output)
    setBackup(output)
  }, [data])
  const getQuery = (e: any) => {
    const val = e.target.value
    setQuery(val)
    const filteredItems = backupData?.filter((el) => {
      const check1 = el.first_name.toLowerCase().includes(val.toLowerCase())
      const check2 = el.last_name.toLowerCase().includes(val.toLowerCase())
      return check1 || check2
    })
    setStudentData(filteredItems)
  }
  const SortByOrder = (type:string) => {
    setOrder(type)
    let sortedData = [...studentData].sort((a, b) => {
      if (type === "ascending") {
        return a[sortKey] > b[sortKey] ? 1 : -1;
      } else {
        return a[sortKey] < b[sortKey] ? 1 : -1;
      }
    });
    setStudentData(sortedData);
  }
  const getKey=(e:any)=>{
    const val =e.target.value;
    setSortKey(val)
  }
  useEffect(()=>{
    SortByOrder(sortorder)
  },[sortKey])
  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} sortorder={sortorder} SortByOrder={SortByOrder} getQuery={getQuery} getKey={getKey} sortKey={sortKey}/>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData?.map((s) => (
              <StudentListTile id={s.id} role={s.role} isRollMode={isRollMode} student={s} key={s.id} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  getQuery: (value?: any) => void
  getKey:(value?: any)=>void
  sortKey:string
  SortByOrder:(value:string)=>void
  sortorder:string
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, getQuery,getKey,sortKey,SortByOrder,sortorder } = props

  return (
    //togglebox
    <S.ToolbarContainer>
      <div className="sort_wrapper">
        <div className="Togglebtns">
          <div className={sortorder=="ascending"?"toggleActive":"togglebox"} onClick={()=>SortByOrder("ascending")}>A-Z</div>
          <div className={sortorder=="descending"?"toggleActive":"togglebox"} onClick={()=>SortByOrder("descending")}> Z-A</div>
        </div>
       {sortorder? <select id="category" style={{padding:"3px",borderRadius:"4px"}} value={sortKey} onChange={(e)=>getKey(e)}>
          <option value="none" hidden={true}>
            Select
          </option>
          <option value="first_name" style={{fontSize:"15px"}}>FirstName</option>
          <option value="last_name" style={{fontSize:"15px"}}>LastName</option>
        </select>:null}
      </div>
      <div style={{display:"flex",background:"white",padding:"5px",borderRadius:"4px"}}>
        <input type="text" style={{border:"none",outline:"none"}} onChange={(e) => getQuery(e)} placeholder="Search By Name"></input>
        <img src={Search} height={15} width={20} alt="icon"/>
      </div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToggleBtns: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}

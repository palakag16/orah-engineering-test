import React,{useEffect}from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<any>({ url: "get-activities" })
  useEffect(() => {
    void getActivities()
  }, [])
  return <>
  <S.Container>Activity Page</S.Container>
  <div className="activity_wrapper">
  {data?.activity &&
   data?.activity?.map((el:any)=>{
    return <div className="activity_tile">Role - {el?.entity?.name}</div>
   })
  }
  </div>
  </>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content:center;
    font-size:20px;
    align-items:center;
    margin:16px;
  `,
}

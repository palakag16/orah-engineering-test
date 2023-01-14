export interface Person {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  role?:string

}

export interface PersonFull {
  id: number
  first_name: string
  last_name: string
  photo_url?: string
  role:string
}
export const PersonHelper = {
  getFullName: (p: Person) => `${p.first_name} ${p.last_name}`,
}

export type PersonContextType = {
  studentData: Person[]|undefined;
  setStudentData:React.Dispatch<React.SetStateAction<Person[]>> | []
  backupData?: Person[];
  setBackup?:React.Dispatch<React.SetStateAction<Person[]>> | []
};

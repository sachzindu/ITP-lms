import api from "../services/api";
import { useState, useEffect, createContext } from "react";


let AppContext = createContext({
  data: [],
  isError: "",
  uid:"",
  setData:()=>{},
  setId:()=>{}
  
});

export const AppProvider = ({ children }) => {

 let initialValue=[];
  let iniValue="";
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('myContextData');
    return saved ? JSON.parse(saved) : initialValue;
  });

  const [uid, setId] = useState(() => {
    const saved = localStorage.getItem('myContextId');
    return saved ? JSON.parse(saved) : iniValue;
  });

  useEffect(() => {
    localStorage.setItem('myContextId', JSON.stringify(uid));
  }, [uid]);

  useEffect(() => {
    localStorage.setItem('myContextData', JSON.stringify(data));
  }, [data]);

  const [isError, setIsError] = useState(null);



 const refreshData = async () => {
    try {
      const response = await api.get("http://localhost:3000/api/v1/course/");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  
  useEffect(() => {
    refreshData();
  }, []);


  return (
    <AppContext.Provider value={{ data,uid,setData,setId }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;

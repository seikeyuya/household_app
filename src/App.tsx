import React, { useEffect, useState } from 'react';

import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { Transaction } from './types/index';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from './firebase';
import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';
import { AppContextProvider, } from './context/AppContext';

function App() {
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(true);

  // FireStoreエラーかどうかを判定する型ガード
//  function isFireStoreError(err: unknown):err is {code: string, message: string} {
//     return typeof err === "object" && err !== null && "code" in err
//   }

  // const {setTransactions, setIsLoading, transactions, currentMonth, setCurrentMonth, isLoading} = useAppContext()

  // // firestoreの全てのデータを全て取得
  // useEffect(() => {
  //   const fetchTransactions = async() =>{
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "Transactions"));
  //       const transactionsData = querySnapshot.docs.map((doc) => {
  //         // doc.data() is never undefined for query doc snapshots
  //         //console.log(doc.id, " => ", doc.data());
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         } as Transaction
  //       });

  //       //console.log(transactionsData);
  //       setTransactions(transactionsData);
  //     } catch (error) {
  //       // error処理
  //       if(isFireStoreError(error)) {
  //         console.error(error);
  //         console.error(error.message);
  //         console.error(error.code);
  //       } else {
  //         console.error("一般的なエラーは:",error);
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }
  //   fetchTransactions();

  // },[])


  

  // 取引を保存する処理
  // const handleSaveTransaction = async (transaction: Schema) => {
  //   //console.log(transaction);
  //   try {
  //     // firestoreにデータを保存
  //     // Add a new document with a generated id.
  //     const docRef = await addDoc(collection(db, "Transactions"), transaction);
  //     //console.log("Document written with ID: ", docRef.id);

  //     const newTransaction = {
  //       id : docRef.id,
  //       ...transaction
  //     } as Transaction

  //     setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);

  //   } catch (error) {
  //     // error処理
  //     if(isFireStoreError(error)) {
  //       console.error(error);
  //       console.error(error.message);
  //       console.error(error.code);
  //     } else {
  //       console.error("一般的なエラーは:",error);
  //     }
  //   }
  // }

  // 取引を削除する処理
  // const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
  //   try {
  //     // 配列かどうか確かめる
  //     const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds]

  //     for(const id of idsToDelete) {
  //       // firestoreのデータの削除
  //       await deleteDoc(doc(db, "Transactions", id));
  //     }
      
  //     // const filteredTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
  //     const filteredTransactions = transactions.filter((transaction) => !idsToDelete.includes(transaction.id));
  //     setTransactions(filteredTransactions);
  //   } catch (error) {
  //     // error処理
  //     if(isFireStoreError(error)) {
  //       console.error(error);
  //       console.error(error.message);
  //       console.error(error.code);
  //     } else {
  //       console.error("一般的なエラーは:",error);
  //     }
  //   }
  // }

  // 取引を更新する処理
  // const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
  //   try {
  //     // firestore更新処理
  //     const docRef = doc(db, "Transactions", transactionId);

  //     // Set the "capital" field of the city 'DC'
  //     await updateDoc(docRef, transaction);
  //     // フロント更新
  //     const updatedTransactions = transactions.map((t) => t.id === transactionId ? {...t, ...transaction} : t) as Transaction[];
  //     setTransactions(updatedTransactions);
  //   } catch (error) {
  //     // error処理
  //     if(isFireStoreError(error)) {
  //       console.error(error);
  //       console.error(error.message);
  //       console.error(error.code);
  //     } else {
  //       console.error("一般的なエラーは:",error);
  //     }
  //   }
  // }

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        {/* ブラウザのデフォルトのCSSをリセットし、MUIのテーマを反映する */}
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route 
                index 
                element={
                  <Home 
                    // monthlyTransactions={monthlyTransactions} 
                    // setCurrentMonth={setCurrentMonth} 
                    // onSaveTransaction = {handleSaveTransaction} 
                    // onDeleteTransaction = {handleDeleteTransaction}
                    // onUpdateTransaction = {handleUpdateTransaction}
                  />
                }
              />
              <Route 
                path="/report" 
                element={
                <Report 
                  // currentMonth={currentMonth} 
                  // setCurrentMonth={setCurrentMonth} 
                  // monthlyTransactions={monthlyTransactions}
                  // isLoading={isLoading}
                  // onDeleteTransaction={handleDeleteTransaction}
                  />
                } 
              />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>

  );
}

export default App;

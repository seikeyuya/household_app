import { Box, useMediaQuery, useTheme } from '@mui/material'
import React, { useMemo, useState } from 'react'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types/index'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'
import { DateClickArg } from '@fullcalendar/interaction'
import { is } from 'date-fns/locale'
import { AppContext, useAppContext } from '../context/AppContext'
import useMonthlyTransactions from '../hooks/useMonthlyTransactions'

// interface HomeProps {
//   monthlyTransactions: Transaction[],
//   setCurrentMonth :React.Dispatch<React.SetStateAction<Date>>,
//   onSaveTransaction :(transaction: Schema) => Promise<void>,
//   onDeleteTransaction :(transactionId: string | readonly string[]) => Promise<void>,
//   onUpdateTransaction :  (transaction: Schema, transactionId: string) => Promise<void>
// }

const Home = (
  // { 
  //   monthlyTransactions, 
  //   setCurrentMonth, 
  //   onSaveTransaction, 
  //   onDeleteTransaction, 
  //   onUpdateTransaction
  // }: HomeProps
  ) => {
  const { isMobile } = useAppContext();
  const monthlyTransactions = useMonthlyTransactions();
  const today = format(new Date(), "yyyy-MM-dd");
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  //選択された取引を管理するstate
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  //const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // 1日分のデータを取得
  const dailyTransactions = useMemo(() => {
    return monthlyTransactions.filter((transaction)=> 
      transaction.date === currentDay
    );
  }, [monthlyTransactions, currentDay]) 

  // 閉じるボタンを押した時
  const closeForm = () => {
    setSelectedTransaction(null);

    if(isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }

  // フォームの開閉処理(内訳追加ボタンを押した時)
  const handleAddTransactionForm = () => {
    if(isMobile) {
      setIsDialogOpen(true);
    } else {
      if(selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction:Transaction) => {
    //console.log(transaction);
    setSelectedTransaction(transaction);
    if(isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  }

  // モバイル用Drawerを閉じるとじる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  }

  // 日付を選択した時の処理
  const handleDateClick = (dateInfo:DateClickArg) => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  }

  return (
    // Boxのデフォルトはdivタグとしてレンダリングされる
    <Box sx={{display: "flex"}}>
      {/* 左側コンテンツ */}
      <Box sx={{flexGrow: 1,}}>
        <MonthlySummary 
          // monthlyTransactions={monthlyTransactions}
        />
      <Calendar 
        // monthlyTransactions={monthlyTransactions} 
        // setCurrentMonth={setCurrentMonth} 
        setCurrentDay={setCurrentDay} 
        currentDay={currentDay} 
        today={today}
        onDateClick={handleDateClick}

      />
      </Box>
      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu 
          dailyTransactions={dailyTransactions} 
          currentDay={currentDay} 
          onAddTransactionForm={handleAddTransactionForm} 
          onSelectTransaction={handleSelectTransaction}
          //isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <TransactionForm 
          onCloseForm={closeForm} 
          isEntryDrawerOpen={isEntryDrawerOpen} 
          currentDay={currentDay} 
          //onSaveTransaction={onSaveTransaction} 
          selectedTransaction={selectedTransaction}
          //onDeleteTransaction={onDeleteTransaction}
          setSelectedTransaction={setSelectedTransaction}
          //onUpdateTransaction={onUpdateTransaction}
          //isMobile={isMobile}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
      </Box>

    </Box>
  )
}

export default Home
import FullCalendar from '@fullcalendar/react'
import React from 'react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocal from '@fullcalendar/core/locales/ja'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core'
import "../calendar.css"
import { Balance, CalendarContent, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formatCurrency } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Palette } from '@mui/icons-material'
import { useTheme } from '@mui/material'
import { format, isSameMonth } from 'date-fns'
import useMonthlyTransactions from '../hooks/useMonthlyTransactions'
import { useAppContext } from '../context/AppContext'

interface CalendarProps {
  // monthlyTransactions: Transaction[],
  // setCurrentMonth:React.Dispatch<React.SetStateAction<Date>>,
  setCurrentDay:React.Dispatch<React.SetStateAction<string>>,
  currentDay:string,
  today:string,
  onDateClick: (dateInfo: DateClickArg) => void
}

const Calendar = (
  {
    // monthlyTransactions,
    // setCurrentMonth,
    setCurrentDay,
    currentDay,today,
    onDateClick
  }:CalendarProps
  ) => {
  const monthlyTransactions = useMonthlyTransactions();
  const { setCurrentMonth } = useAppContext();
  // const events = [
  //   { title: 'Meeting', start: new Date() },
  //   { title: 'Meeting', start: "2024-06-05", income: 300, expense: 200, balance:300}
  // ]
  const theme = useTheme();

  //　月の日付ごとの取引データ
  const dalilyBalances = calculateDailyBalances(monthlyTransactions)
  
  // FullCalender用のイベントを生成する関数
  const createCalendarEvents = (dalilyBalances:Record<string, Balance> ) :CalendarContent[]=> {
    return Object.keys(dalilyBalances).map((date) => {
      const {income,expense,balance} = dalilyBalances[date]
      return {
        start: date,
        income:formatCurrency(income),
        expense:formatCurrency(expense),
        balance:formatCurrency(balance)
      }
    })
  }

  const calendarEvents = createCalendarEvents(dalilyBalances);

  const backgrountEvent = {
    start: currentDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light
  }
  
  // カレンダーの見た目を作る関数
  const renderEventContent = (eventInfo:EventContentArg) => {
    return (
      <div>
        {/* 収入 */}
        <div className='money' id='event-income'>
          {eventInfo.event.extendedProps.income}
        </div>

        {/* 支出 */}
        <div className='money' id='event-expense'>
          {eventInfo.event.extendedProps.expense}
        </div>

        {/* 残高 */}
        <div className='money' id='event-balance'>
          {eventInfo.event.extendedProps.balance}
        </div>
      </div>
    )
  }

  // 月の日付取得
  const handleDateSet = (datesetInfo:DatesSetArg) => {
    const currentMonth = datesetInfo.view.currentStart;
    setCurrentMonth(currentMonth);
    const todayDate = new Date();
    if(isSameMonth(todayDate, currentMonth)){
      setCurrentDay(today);
    }
    
  };

  

  return (
    <FullCalendar 
      locale={jaLocal}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView='dayGridMonth'
      events={[...calendarEvents, backgrountEvent]}
      eventContent={renderEventContent}
      datesSet={handleDateSet}
      dateClick={onDateClick}
    />
  )
}

export default Calendar
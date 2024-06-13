import React, { useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { formatMonth } from '../utils/formatting'
import { Transaction } from '../types'

const useMonthlyTransactions = () : Transaction[]=> {

    const {transactions, currentMonth} = useAppContext()
    // 月間の取引データを取得(filterでひと月分だけを取ってくる)
    // transactionsとcurrentmonthが変更されたときのみusestateの中が実行される。
    const monthlyTransactions = useMemo(() => 
        transactions.filter((transaction)=> 
            transaction.date.startsWith(formatMonth(currentMonth))
        )
    , [transactions, currentMonth]);

    return monthlyTransactions;
}

export default useMonthlyTransactions
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // 閉じるボタン用のアイコン
import FastfoodIcon from "@mui/icons-material/Fastfood"; //食事アイコン
import AlarmIcon from '@mui/icons-material/Alarm';
import AddHomeIcon from '@mui/icons-material/AddHome';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import SavingsIcon from '@mui/icons-material/Savings';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExpenseCategory, IncomeCategory, Transaction } from "../types";
import { zodResolver } from "@hookform/resolvers/zod"
import { Schema, transactionSchema } from "../validations/schema";
import { AppContext, useAppContext } from "../context/AppContext";

interface TransactionFormProps {
  onCloseForm: () => void,
  isEntryDrawerOpen:boolean,
  currentDay:string,
  // onSaveTransaction: (transaction: Schema) => Promise<void>,
  selectedTransaction: Transaction | null,
  // onDeleteTransaction :(transactionId: string | readonly string[]) => Promise<void>,
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>,
  // onUpdateTransaction :  (transaction: Schema, transactionId: string) => Promise<void>,
  // isMobile: boolean,
  isDialogOpen: boolean,
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type IncomeExpense = "income" | "expense";

interface CategoryItem {
  label:IncomeCategory | ExpenseCategory;
  icon: JSX.Element
}

const TransactionForm = (
  {
    onCloseForm,
    isEntryDrawerOpen,
    currentDay,
    // onSaveTransaction, 
    selectedTransaction, 
    // onDeleteTransaction, 
    setSelectedTransaction, 
    // onUpdateTransaction, 
    // isMobile, 
    isDialogOpen, 
    setIsDialogOpen
  }:TransactionFormProps) => {
  const {onSaveTransaction, onDeleteTransaction, onUpdateTransaction, isMobile} = useAppContext();
  //useAppContextでundefinedの場合の処理を記述しているのでこのif文は不要
  // if(context) {
  //   context.transactions
  // }
  const formWidth = 320;

  const expenseCategories:CategoryItem[] = [
    {label: "食費", icon: <FastfoodIcon fontSize="small" />},
    {label: "日用品", icon: <AlarmIcon fontSize="small" />},
    {label: "住居費", icon: <AddHomeIcon fontSize='small' />},
    {label: "交際費", icon: <Diversity3Icon fontSize="small" />},
    {label: "娯楽", icon: <SportsTennisIcon fontSize="small" />},
    {label: "交通費", icon: <TrainIcon fontSize="small" />},
  ];

  const incomeCategories:CategoryItem[] = [
    {label: "給与", icon: <WorkIcon fontSize="small" />},
    {label: "副収入", icon: <SavingsIcon fontSize="small" />},
    {label: "お小遣い", icon: <AddBusinessIcon fontSize="small" />},
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {control, setValue, watch, formState:{errors}, handleSubmit, reset} = useForm<Schema>({
    defaultValues: {
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    },
    resolver: zodResolver(transactionSchema)
  });
  //console.log(errors);

  // 収支タイプを切り替える関数
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue("type", type)
    setValue("category", "")
  }

  // 収支タイプを監視
  const currentType = watch("type");

  // 収支タイプに応じたカテゴリを取得
  useEffect(() =>{
    const newCategories = currentType === "expense" ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  },[currentType])

  // カレンダー上の選択した日付を取得してセット
  useEffect(() => {
    setValue("date", currentDay);
  },[currentDay])

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    //console.log(data);
    
    if(selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
      .then(() => {
        // console.log("更新しました")
        setSelectedTransaction(null);
        if(isMobile) {
          setIsDialogOpen(false)
        }
      })
      .catch((error) => {
        console.error(error);
      });
    } else {
      onSaveTransaction(data)
      .then(() => {
        console.log("保存しました")
      })
      .catch((error) => {
        console.error(error);
      });;
    }
    reset({
      type: "expense",
      date: currentDay,
      amount: 0,
      category: "",
      content: "",
    });
  }

  useEffect(() => {
    // 選択肢が更新されたか確認
    if(selectedTransaction) {
      const categoryExists = categories.some((category) => category.label === selectedTransaction.category);
      setValue("category", categoryExists ? selectedTransaction.category : "");
    }
    
  }, [selectedTransaction, categories])

  // フォーム内容の更新(削除の時に値がカードの値になる処理)
  useEffect(() => {
    if(selectedTransaction) {
      setValue("type", selectedTransaction.type);
      setValue("date", selectedTransaction.date);
      setValue("amount", selectedTransaction.amount);
      setValue("content", selectedTransaction.content);
    } else {
      reset({
        type: "expense",
        date: currentDay,
        amount: 0,
        category: "",
        content: "",
      });
    }
  }, [selectedTransaction])

  // 削除処理
  const handleDelete = () => {
    if(selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
      if(isMobile) {
        setIsDialogOpen(false);
      }
    }
  }
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={"flex"} justifyContent={"space-between"} mb={2}>
          <Typography variant="h6">入力</Typography>
          {/* 閉じるボタン */}
          <IconButton
            onClick={onCloseForm}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* フォーム要素 */}
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {/* 収支切り替えボタン */}
            <Controller 
              name="type"
              control={control}
              render={({field}) => (
                <ButtonGroup fullWidth >
                  <Button variant={field.value=== "expense" ? "contained" : "outlined"} color="error" onClick={() => incomeExpenseToggle("expense")}>
                    支出
                  </Button>
                  <Button variant={field.value=== "income" ? "contained" : "outlined"} color="primary" onClick={() => incomeExpenseToggle("income")}>
                    収入
                  </Button>
                </ButtonGroup>
              )}
            />
            
            {/* 日付 */}
            <Controller 
              name="date"
              control={control}
              render={({field}) => (
                <TextField
                  {...field}
                  label="日付"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />
            
            {/* カテゴリ */}
            <Controller 
              name="category"
              control={control}
              render={({field}) => (
                <TextField 
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  {...field} 
                  id="カテゴリ" 
                  label="カテゴリ" 
                  select
                  InputLabelProps={{
                    htmlFor: "category",
                  }}
                  inputProps={{id: "category"}}
                >
                  {categories.map((category, index) => (
                    <MenuItem value={category.label} key={index}>
                      <ListItemIcon>
                        {category.icon}
                      </ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                  
                </TextField>
                // <FormControl fullWidth error={!!errors.category} >
                //   <InputLabel id="category-select-label">カテゴリ</InputLabel>
                //   <Select 
                //     labelId="category-select-label"
                //     id="category-select" 
                //     label="カテゴリ"  
                //     {...field} 
                //   >
                //     {categories.map((category, index) => (
                //     <MenuItem value={category.label} key={index}>
                //       <ListItemIcon>
                //         {category.icon}
                //       </ListItemIcon>
                //       {category.label}
                //     </MenuItem>
                //   ))}
                //   </Select>
                //   <FormHelperText>{errors.category?.message}</FormHelperText>
                // </FormControl>
              )}

            />
            
            {/* 金額 */}
            <Controller 
            name="amount"
            control={control}
            render={({field}) => (
              <TextField 
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field} 
                label="金額" 
                type="number" 
                value={field.value === 0 ? "" : field.value}
                onChange={(e) => {
                  // fieldの数値はデフォルトで文字列になっているので数値型に変換
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
              />
            )}
            />
            
            {/* 内容 */}
            <Controller 
              name="content"
              control={control}
              render={({field}) => (
                <TextField 
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  {...field} 
                  label="内容" 
                  type="text" 
                />
              )}
            />

            {/* 保存ボタン */}
            <Button type="submit" variant="contained" color={currentType === "income" ? "primary" : "error"} fullWidth>
              {selectedTransaction ? "更新" : "保存"}
            </Button>
            {selectedTransaction && (
              <Button onClick={handleDelete} variant="outlined" color={"secondary"} fullWidth>
              削除
              </Button>
            )}
          </Stack>
        </Box>
    </>
  )

  return (
    <>
    {isMobile ? (
      // mobile用の見た目
      <Dialog open={isDialogOpen} onClose={onCloseForm} fullWidth maxWidth={"sm"} >
        <DialogContent>
          {formContent}
        </DialogContent>
      </Dialog>
    ) : (
      // pc用の見た目
      <Box
        sx={{
          position: "fixed",
          top: 64,
          right: isEntryDrawerOpen? formWidth : "-2%",  // フォームの位置を調整
          width: formWidth,
          height: "100%",
          bgcolor: "background.paper",
          zIndex: (theme) => theme.zIndex.drawer - 1,
          transition: (theme) =>
            theme.transitions.create("right", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          p: 2, // 内部の余白
          boxSizing: "border-box", // ボーダーとパディングをwidthに含める
          boxShadow: "0px 0px 15px -5px #777777",
        }}
      >
        {formContent}
        
      </Box>
    )}
    </>
  );
};
export default TransactionForm;

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface BalanceData {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionData {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      // TODO
      await api
        .get('transactions')
        .then(result => {
          const dataTransaction: TransactionData[] = result.data.transactions;
          const dataBalance: BalanceData = result.data.balance;

          const newTransactions: Transaction[] = dataTransaction.map(
            (trans: TransactionData) => {
              const newValue: string =
                trans.type === 'outcome'
                  ? `- ${formatValue(trans.value)}`
                  : formatValue(trans.value);
              return {
                id: trans.id,
                title: trans.title,
                value: trans.value,
                type: trans.type,
                category: { title: trans.category.title },
                formattedValue: newValue,
                formattedDate: new Intl.DateTimeFormat('pt-BR').format(
                  new Date(trans.created_at),
                ),
                created_at: trans.created_at,
              };
            },
          );

          const newBalance = {
            income: formatValue(dataBalance.income),
            outcome: formatValue(dataBalance.outcome),
            total: formatValue(dataBalance.total),
          };

          setTransactions(newTransactions);
          setBalance(newBalance);
        })
        .catch(err => {
          console.log(err);
        });
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map((transaction: Transaction) => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;

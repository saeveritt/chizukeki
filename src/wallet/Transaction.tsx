import * as React from 'react'
import { View, Platform } from 'react-native'
import { Button, Card, CardItem, Text, H2, Badge, Switch } from 'native-base'

import FlatList from '../generics/FlatList'
import moment from 'moment'

import { Secondary } from '../generics/Layout'
import Transaction from '../generics/transaction-like'
import { Wallet } from '../explorer'

namespace WalletTransaction {
  export type Data = Wallet.Transaction
}

function AssetAction({ assetAction }: { assetAction?: string }){
  return assetAction ?
    <Badge styleNames='info' style={{ height: 22 }}>
      <Text style={{ fontSize: 12 }}>{assetAction}</Text>
    </Badge> :
    null
}

function TransactionDetails({ confirmations, id, assetAction }: WalletTransaction.Data) {
  return (
    <CardItem styleNames='footer' style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Text styleNames='bounded note' ellipsizeMode='middle' numberOfLines={1}>
        id: {id}
      </Text>
      <Text styleNames='bounded note' ellipsizeMode='middle' numberOfLines={1}>
        confirmations: {confirmations || 'pending'}
      </Text>
      <AssetAction assetAction={assetAction}/>
    </CardItem>
  )
}

class WalletTransaction extends React.PureComponent<WalletTransaction.Data & { hide?: boolean }> {
  render() {
    let { hide, ...item } = this.props
    if (hide) {
      return null
    }
    return (
      <Transaction asset={<Text>PPC <AssetAction assetAction={item.assetAction}/></Text>} {...item}>
        <TransactionDetails {...item} />
      </Transaction>
    )
  }
}

namespace TransactionList {
  export type Data = Array<WalletTransaction.Data>
}

class TransactionList extends React.Component<
  { transactions: TransactionList.Data },
  { showAssets: boolean }
> {
  toggleFilter = (showAssets = !this.state.showAssets) =>
    this.setState({ showAssets })
  constructor(props){
    super(props)
    this.state = { showAssets: true }
  }
  render() {
    let showAssets = this.state.showAssets
    let transactions = this.props.transactions
    let style = {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 3,
      paddingRight: 3,
    }
    return (
      <Secondary>
        <View style={style as any}>
          <Text>
            <H2>Transactions</H2>
            <Text styleNames='note'> {transactions.length} total </Text>
          </Text>
          <Button styleNames={`${Platform.OS === 'web' ? 'small' : ''} info`} onPress={() => this.toggleFilter()}
            style={{ paddingLeft: 0, paddingRight: 10 }} >
            <Text>Asset Actions</Text>
            <Switch value={showAssets} />
          </Button>
        </View>
        <FlatList
          data={transactions.map(item => item.assetAction ? { hide: !showAssets, ...item } : item)}
          keyExtractor={t => t.id}
          renderItem={({ item }) =>
            <WalletTransaction key={item.id} {...item} />
          }/>
      </Secondary>
    )
  }
}

export { WalletTransaction }
export default TransactionList

import { Satoshis, HTTP } from '../lib/utils'

namespace Wallet {
  export type UTXO = {
    txid: string,
    scriptPubKey: string | {
      addresses: Array<string>,
      asm: string,
      hex: string,
      reqSigs: number,
      type: string,
    },
    vout: number,
    amount: number,
    // unused address, confirmations
  }
  export type Transaction = {
    balance: number,
    amount: number,
    fee: number,
    id: string,
    block: number,
    confirmations: number,
    timestamp: Date,
    raw?: {
      [key: string]: any,
      vout: Array<UTXO>,
      vin: Array<any>,
    },
    addresses: Array<string>,
    assetAction?: 'DeckSpawn' | 'CardTransfer'
  }
  export type PendingTransaction = Pick<
    Transaction,
    'id' | 'amount' | 'timestamp' | 'raw' | 'fee' | 'addresses'
  >
  export function empty(address: string): Wallet {
    return Object.assign(
      walletMeta(), {
        address,
        balance: 0,
        sent: 0,
        received: 0,
        totalTransactions: 0,
        transactions: [],
        unspentOutputs: []
    })
  }
}

type Wallet = {
  _meta: {
    created: Date,
    updated: Date,
    lastSeenBlock: number,
    syncState: 'DEFAULT' | 'OPTIMISTICALLY_PENDING'
  },
  address: string,
  received: number,
  sent: number,
  balance: number,
  totalTransactions: number,
  transactions: Array<Wallet.Transaction>,
  unspentOutputs: Array<Wallet.UTXO>
}

export function walletMeta(
  { lastSeenBlock = 0 }: { lastSeenBlock?: number } = {}
): Pick<Wallet, '_meta'> {
  let created = new Date()
  return {
    _meta: {
      created,
      updated: created,
      lastSeenBlock,
      syncState: 'DEFAULT'
    }
  }
}

export { Wallet, Satoshis, HTTP }

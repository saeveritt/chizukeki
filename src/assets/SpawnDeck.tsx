import * as React from 'react';
import { Dimensions, View, TouchableOpacity, ActivityIndicator, StyleProp } from 'react-native';
import RoutineButton from '../generics/routine-button'
import {
  Form,
  Container,
  Segment,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  H2,
  Body,
  Input,
  Button,
  Item,
  Right,
  Icon,
  Label,
  variables
} from 'native-base'

import bitcore from '../lib/bitcore'
import { Wrapper } from '../generics/Layout'

import { WrapActionable } from '../wallet/UnlockModal'
import Wallet from '../wallet/Wallet'

import IssueMode from './IssueMode'

// TODO update to ts 2.8
type Diff<T extends string, U extends string> = (
  {[P in T]: P } & {[P in U]: never } & { [x: string]: never }
)[T]  
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;  

type Fillable<T, K extends keyof T = keyof T> = Omit<T, K> & {
  [k in K]: null | T[k]
}
namespace Fillable {
  export function isFilled<T, K extends keyof T = keyof T>(fillable: T | Fillable<T, K>): fillable is T {
    for (let v of Object.values(fillable)) {
      if (v === null) {
        return false
      }
    }
    return true
  }
}

namespace SpawnDeck {
  export type Data = {
    name: string,
    precision: number,
    issueMode: IssueMode.Data
  }
  export type Props = {
    stage?: string | undefined,
    style?: StyleProp<any>,
    spawn: (data: Data & { wallet: Wallet.Unlocked }) => void,
    wallet: Wallet.Data,
  }
  export type Payload = Data & {
    wallet: Wallet.Unlocked
  }
}

type State = SpawnDeck.Data | Fillable<SpawnDeck.Data, 'name' | 'issueMode'>

function isFilled(state: State): state is SpawnDeck.Data {
  return Fillable.isFilled<SpawnDeck.Data, 'name' | 'issueMode'>(state)
}

function SpawnButton(props: { stage: string | undefined, disabled: boolean, onPress: () => any }) {
  return <RoutineButton
    styleNames='block'
    icons={{ DEFAULT: 'send' }}
    DEFAULT='Spawn Deck'
    STARTED='Spawning'
    DONE='Spawned!'
    FAILED='Invalid Deck'
    {...props} />
}

class SpawnDeck extends React.Component<SpawnDeck.Props, State> {
  state: State = {
    name: '',
    issueMode: null,
    precision: 0,
  }
  spawn = (privateKey: string) => {
    if (isFilled(this.state)) {
      let wallet = Object.assign({ privateKey }, this.props.wallet)
      this.props.spawn({ wallet, ...this.state })
    }
  }
  render() {
    let { wallet: { keys, balance } } = this.props
    let { precision = 0 } = this.state

    return (
      <Card style={this.props.style}>
        <CardItem styleNames='header' style={{ paddingBottom: 0 }}>
          <H2 style={{ flexBasis: 200, paddingBottom: 0 }}>Spawn a new Deck</H2>
        </CardItem>
        <CardItem style={{ flex: 0 }}>
          <Body style={{ flexDirection: 'column', justifyContent: 'space-around', width: '100%', flexWrap: 'wrap', flex: 0 }}>
            <Form>
              <Item styleNames='fixedLabel' style={{ marginLeft: 15, minWidth: 300 }}>
                <Label>Name</Label>
                <Input
                  style={{ lineHeight: 14 }}
                  value={this.state.name || ''}
                  onChangeText={name => this.setState({ name })} />
              </Item>
              <Item styleNames='fixedLabel' style={{ marginLeft: 15, minWidth: 300 }}>
                <Label>Decimal Precision</Label>
                <Input
                  keyboardType='numeric'
                  placeholder='0'
                  style={{ lineHeight: 14 }}
                  value={Number.isFinite(precision) ? `${precision}` : '0'}
                  onChangeText={_precision => {
                    let precision = Number(_precision) || 0
                    this.setState({ precision })
                  }} />
              </Item>
              <Item styleNames='fixedLabel' style={{ marginLeft: 15, minWidth: 300, minHeight: 50, flex: 0 }}>
                <Label style={{ maxWidth: 100 }}>Issue Mode</Label>
                <IssueMode style={{ width: 200, backgroundColor: variables.brandLight }} selected={this.state.issueMode}
                  select={(issueMode: IssueMode.Data) => this.setState({ issueMode })} />
              </Item>
            </Form>
          </Body>
        </CardItem>
        <CardItem styleNames='footer'>
          <Body>
            <WrapActionable.IfLocked
              keys={keys}
              actionProp='onPress'
              action={this.spawn}
              Component={SpawnButton}
              componentProps={{
                disabled: (!isFilled(this.state)),
                stage: this.props.stage
              }}
            />
          </Body>
        </CardItem>
      </Card>
    )
  }
}


export default SpawnDeck


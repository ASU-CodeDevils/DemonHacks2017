import React, { Component } from 'react'
import CodeInput from './CodeInput.js'
import CodeDisplay from './CodeDisplay.js'
import './Typer.css'

function formatData (code) {
  return code.split('\n').map(line => {
    if (line === '') {
      return ' \n'
    } else {
      return line + '\n'
    }
  })
}

class Typer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isRemote: props.isRemote,
      charactersTyped: 0,
      currentLine: 0,
      firstMistake: -1,
      shouldLineReset: false,
      formattedData: formatData(props.codeData),
      score: 0
    }
  }
  componentWillReceiveProps ({remoteState}) {
    if (this.state.isRemote) {
      this.setState({
        ...this.state,
        ...remoteState
      })
    }
  }
  increment () {
    this.setState({
      ...this.state,
      lines: this.state.lines + 1
    })
  }
  codeChanged (currVal, isEnter) {
    const charsTyped = currVal.length
    let firstMistake = -1
    for (let i = 0; i < charsTyped; i++) {
      if (currVal[i] !== this.state.formattedData[this.state.currentLine][i]) {
        firstMistake = i
        break
      }
    }
    const lineLength = this.state.formattedData[this.state.currentLine].length
    if (charsTyped - lineLength <= 2 && firstMistake === -1 && isEnter) {
      this.setState({
        ...this.state,
        shouldLineReset: true,
        currentLine: this.state.currentLine + 1,
        charactersTyped: 0,
        score: this.state.score + this.state.charactersTyped + 1
      })
    } else {
      this.setState({
        ...this.state,
        charactersTyped: charsTyped,
        firstMistake: firstMistake
      })
    }
    if (!this.state.isRemote) {
      let scoreBonus = this.state.firstMistake !== -1 ? this.state.firstMistake : this.state.charactersTyped
      const currState = {
        charactersTyped: this.state.charactersTyped,
        currentLine: this.state.currentLine,
        firstMistake: this.state.firstMistake,
        shouldLineReset: this.state.shouldLineReset,
        score: this.state.score + scoreBonus
      }
      this.props.onStateChange(currState)
    }
  }
  resetCallback () {
    this.setState({
      ...this.state,
      shouldLineReset: false
    })
  }
  render () {
    if (this.state.isRemote) {
      return (
        <div className='App'>
          <CodeDisplay currentLineIdx={this.state.currentLine} firstMistake={this.state.firstMistake} charactersTyped={this.state.charactersTyped}>
            {
              this.state.formattedData.slice(
                0,
                this.state.currentLine + 6
              )
            }
          </CodeDisplay>
        </div>
      )
    } else {
      return (
        <div className='App'>
          <CodeDisplay currentLineIdx={this.state.currentLine} firstMistake={this.state.firstMistake} charactersTyped={this.state.charactersTyped}>
            {
              this.state.formattedData.slice(
                0,
                this.state.currentLine + 6
              )
            }
          </CodeDisplay>
          <CodeInput shouldLineReset={this.state.shouldLineReset} resetCallback={this.resetCallback.bind(this)} currentLine={this.state.formattedData[this.state.currentLine]} changeCallback={this.codeChanged.bind(this)} />
        </div>
      )
    }
  }
}

export default Typer

import React from 'react'
import './CodeInput.css'

class CodeInput extends React.Component {
  componentWillReceiveProps ({shouldLineReset}) {
    if (shouldLineReset) {
      this.el.value = ''
      this.props.resetCallback()
    }
  }
  handleChange (e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      e.target.value = e.target.value + '  '
    }
    this.props.changeCallback(e.target.value, e.key === 'Enter')
  }
  onKeyDown (e) {
    if (e.key === 'Backspace' || e.key === 'Enter') {
      this.handleChange(e)
    }
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }
  onKeyUp (e) {
    if (e.key !== 'Enter') {
      this.handleChange(e)
    }
  }
  setEl (el) {
    this.el = el
  }
  render () {
    return (
      <input className='inText' ref={this.setEl.bind(this)} onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)} />
    )
  }
}

export default CodeInput

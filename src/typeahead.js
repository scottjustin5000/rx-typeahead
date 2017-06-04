import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

import loadfonts from './font-loader'

class Typeahead extends Component {
  constructor (props) {
    super(props)
    loadfonts()
    this.state = {
      isOpen: false,
      selectedIndex: null
    }

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.arrowDown = this.arrowDown.bind(this)
    this.arrowUp = this.arrowUp.bind(this)
    this.onEnter = this.onEnter.bind(this)

    this.keyEvents = {
      'ArrowUp': this.arrowUp,
      'ArrowDown': this.arrowDown,
      'Enter': this.onEnter
    }

    this.styles = {
      item: {
        padding: '0 23px',
        whiteSpace: 'nowrap',
        lineHeight: '42px',
        cursor: 'default'
      },
      dropDownStyle: {
        borderRadius: '3px',
        boxShadow: '0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)',
        background: 'rgba(255, 255, 255, 0.9)',
        fonstSize: '95%',
        padding: '6px 0',
        position: 'fixed',
        overflow: 'auto',
        maxHeight: '50%',
        overflowY: 'scroll',
        border: '1px solid rgba(0,0,0,.15)'
      },
      highlighted: {
        padding: '0 23px',
        whiteSpace: 'nowrap',
        lineHeight: '42px',
        cursor: 'default',
        backgroundColor: '#eeeeee'
      },
      container: {
        fontFamily: '"Roboto", sans-serif',
        display: 'inline-block',
        width: '300px'
      },
      menu: {
        border: 'solid 1px #ccc'
      },
      input: {
        'boxSizing': 'borderBox',
        'display': 'block',
        'color': 'rgba(0,0,0,.87)',
        'borderTop': 0,
        'borderLeft': 0,
        'borderRight': 0,
        'borderBottom': '1px solid rgba(0,0,0,.26)',
        'outline': 0,
        'width': '100%',
        'padding': 0,
        'borderRadius': 0,
        'fontSize': '14px',
        'fontFamily': 'inherit',
        'lineHeight': 'inherit',
        ':focus': {
          borderBottom: '2px solid rgba(33, 150, 243, 1)'
        }
      }
    }
  }

  setSelected (selected) {
    const value = this.props.setDisplay(selected)
    this.setState({
      isOpen: false,
      selectedIndex: null
    }, () => {
      this.props.onSelect(value, selected)
    })
  }

  filter () {
    let items = this.props.items.filter((item) => (
      this.props.itemMatches(item, this.props.displayValue)
    ))

    items.sort((a, b) => (
        this.props.sortResults(a, b, this.props.displayValue)
      ))

    return items
  }

  arrowUp (event) {
    event.preventDefault()

    let { selectedIndex } = this.state
    let index = selectedIndex === null ? 0 : selectedIndex - 1

    let el = this[`item-${index}`]
    if (!el) return

    this.item.scrollTop = 0
    let ny = (el.offsetTop + el.offsetHeight) - this.item.offsetHeight
    this.item.scrollTop = ny

    this.setState({
      selectedIndex: index,
      isOpen: true
    })
  }

  arrowDown (event) {
    event.preventDefault()
    let { selectedIndex } = this.state

    let index = selectedIndex === null ? 0 : selectedIndex + 1

    let el = this[`item-${index}`]
    if (!el) return

    this.item.scrollTop = 0
    let ny = (el.offsetTop + el.offsetHeight) - this.item.offsetHeight
    this.item.scrollTop = ny
    this.setState({
      selectedIndex: index,
      isOpen: true
    })
  }

  onEnter (event) {
    if (!this.state.isOpen) return
    if (this.state.selectedIndex == null) {
      this.setState({ isOpen: false })
    } else {
      event.preventDefault()
      let item = this.filter()[this.state.selectedIndex]
      let value = this.props.setDisplay(item)
      this.setState({
        isOpen: false,
        highlightedIndex: null
      }, () => {
        this.props.onSelect(value, item)
      })
    }
  }

  onHover (index) {
    this.setState({ selectedIndex: index })
  }

  onBlur (e) {
    // this.setState({ isOpen: false })
  }

  onFocus (e) {
    this.setState({ isOpen: true })
  }

  onChange (e) {
    this.props.onChange(e, e.target.value)
  }

  onKeyDown (e) {
    if (this.keyEvents[e.key]) {
      return this.keyEvents[e.key](e)
    }
    this.setState({ selectedIndex: null, isOpen: true })
  }

  onSelected (event) {
    this.props.onSelected(event)
  }

  renderList () {
    let items = this.filter().map((item, index) => {
      let element = this.renderItem(item, this.state.selectedIndex === index, {cursor: 'default'})
      return React.cloneElement(element, {
        key: `item-${index}`,
        onMouseEnter: () => this.onHover(index),
        onClick: () => this.setSelected(item),
        ref: (e) => { this[`item-${index}`] = e }
      })
    })

    const style = {
      minWidth: this.input.offsetWidth
    }

    const item = this.renderListItems(items, this.props.value, style)

    return React.cloneElement(item, { ref: (me) => { this.item = me } })
  }

  renderItem (item, isHighlighted) {
    return (
      <div
        style={isHighlighted ? this.styles.highlighted : this.styles.item}
        key={item.id}>{item.label}</div>
    )
  }

  renderListItems (items, value, style) {
    return <div style={{...style, ...this.styles.dropDownStyle}} children={items} />
  }

  render () {
    return (
      <div style={this.styles.container}>
        <input style={this.styles.input}
          type='text'
          role='combobox'
          placeholder={this.props.placeholder},
          aria-autocomplete='list'
          autoComplete='on'
          ref={(input) => { this.input = input }}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          value={this.props.displayValue}
          />
        { this.state.isOpen && this.renderList() }
      </div>
    )
  }
}

Typeahead.propTypes = {
  items: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  displayValue: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  itemMatches: PropTypes.func,
  sortResults: PropTypes.func,
  setDisplay: PropTypes.func,
  setDisplay: PropTypes.func,
  inputProps: PropTypes.object
}

Typeahead.defaultProps = {
  displayValue: '',
  placeholder: 'search...',
  inputProps: {},
  onChange () {},
  onSelected () {},
  setDisplay (item) { return item ? item.label : '' },
  itemMatches (data, value) {
    return (
      data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      data.id.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  },
  sortResults (a, b, value) {
    const aVal = a.label.toLowerCase()
    const bVal = b.label.toLowerCase()
    const val = value.toLowerCase()
    const positionA = aVal.indexOf(val)
    const positionB = bVal.indexOf(val)
    if (positionA !== positionB) {
      return positionA - positionB
    }
    return aVal < bVal ? -1 : 1
  }

}

export default Radium(Typeahead)

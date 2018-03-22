import classnames from 'classnames'
import _ from 'lodash'
import React, {PureComponent} from 'react'

interface Tag {
  key: string
  value: string
}

interface Props {
  tagKey: string
  tagValues: string[]
  selectedTagValues: string[]
  isUsingGroupBy?: boolean
  onChooseTag: (tag: Tag) => void
  onGroupByTag: (tagKey: string) => void
}

interface State {
  isOpen: boolean
  filterText: string
}

class TagListItem extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      filterText: '',
      isOpen: false,
    }

    this.handleEscape = this.handleEscape.bind(this)
    this.handleChoose = this.handleChoose.bind(this)
    this.handleGroupBy = this.handleGroupBy.bind(this)
    this.handleClickKey = this.handleClickKey.bind(this)
    this.handleFilterText = this.handleFilterText.bind(this)
  }

  public handleChoose(tagValue: string) {
    this.props.onChooseTag({key: this.props.tagKey, value: tagValue})
  }

  public handleClickKey() {
    this.setState({isOpen: !this.state.isOpen})
  }

  public handleFilterText(e) {
    e.stopPropagation()
    this.setState({
      filterText: e.target.value,
    })
  }

  public handleEscape(e) {
    if (e.key !== 'Escape') {
      return
    }

    e.stopPropagation()
    this.setState({
      filterText: '',
    })
  }

  public handleGroupBy(e) {
    e.stopPropagation()
    this.props.onGroupByTag(this.props.tagKey)
  }

  public renderTagValues() {
    const {tagValues, selectedTagValues} = this.props
    if (!tagValues || !tagValues.length) {
      return <div>no tag values</div>
    }

    const filterText = this.state.filterText.toLowerCase()
    const filtered = tagValues.filter(v => v.toLowerCase().includes(filterText))

    return (
      <div className="query-builder--sub-list">
        <div className="query-builder--filter">
          <input
            className="form-control input-sm"
            placeholder={`Filter within ${this.props.tagKey}`}
            type="text"
            value={this.state.filterText}
            onChange={this.handleFilterText}
            onKeyUp={this.handleEscape}
            spellCheck={false}
            autoComplete="false"
          />
          <span className="icon search" />
        </div>
        {filtered.map(v => {
          const cx = classnames('query-builder--list-item', {
            active: selectedTagValues.indexOf(v) > -1,
          })
          return (
            <div
              className={cx}
              onClick={_.wrap(v, this.handleChoose)}
              key={v}
              data-test={`query-builder-list-item-tag-value-${v}`}
            >
              <span>
                <div className="query-builder--checkbox" />
                {v}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  public render() {
    const {tagKey, tagValues, isUsingGroupBy} = this.props
    const {isOpen} = this.state
    const tagItemLabel = `${tagKey} — ${tagValues.length}`

    return (
      <div>
        <div
          className={classnames('query-builder--list-item', {active: isOpen})}
          onClick={this.handleClickKey}
          data-test={`query-builder-list-item-tag-${tagKey}`}
        >
          <span>
            <div className="query-builder--caret icon caret-right" />
            {tagItemLabel}
          </span>
          <div
            className={classnames('btn btn-xs group-by-tag', {
              'btn-default': !isUsingGroupBy,
              'btn-primary': isUsingGroupBy,
            })}
            onClick={this.handleGroupBy}
          >
            Group By {tagKey}
          </div>
        </div>
        {isOpen ? this.renderTagValues() : null}
      </div>
    )
  }
}

export default TagListItem

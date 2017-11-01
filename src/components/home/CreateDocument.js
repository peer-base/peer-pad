import React from 'react'
import CreateDocumentContainer from './CreateDocumentContainer'

const CreateDocument = ({type, onTypeChange, onCreateDocument}) => (
  <form>
    <div className='lh-copy'>
      <label className='db dib-ns fw2 tracked white mv2' style={{fontSize: '28px'}}>
        Create new:
      </label>
      <select
        className='appearance-none fw1 tracked--1 mh3 mv2 ph3 pv2 ba b--dashed b--caribbean-green-soft white tc'
        style={{fontSize: '18px', borderRadius: 0, background: 'none'}}
        value={type}
        placeholder='select type'
        onChange={(e) => onTypeChange(e.target.value)}>
        <DocTypeOption text='Markdown pad' value='markdown' />
        <DocTypeOption text='Rich text pad' value='richtext' />
        <DocTypeOption text='Math pad' value='math' />
      </select>
      <button
        type='button'
        className='input-reset bg-caribbean-green ba bw2 b--caribbean-green white f6 fw5 mv2 ph3 pv2 pointer dim tracked--1'
        onClick={onCreateDocument}>GO</button>
    </div>
  </form>
)

const DocTypeOption = ({text, value}) => (
  <option
    className='black'
    style={{fontSize: '18px'}}
    value={value}>
    {text}
  </option>
)

export default () => (
  <CreateDocumentContainer children={({type, onTypeChange, onCreateDocument}) => (
    <CreateDocument
      type={type}
      onTypeChange={onTypeChange}
      onCreateDocument={onCreateDocument} />
  )} />
)

import React from 'react'

const Tooltip = ({position, data, measureColor}) => {
  return (
    <div className="maps-tooltip-container"
      style={{
        position: 'fixed',
        top: `${position[1] - 42}px`,
        left: `${position[0] + 10}px`,
      }}
    >
      <h5>{ data[0] }</h5>
      <span className="maps-tooltip-divider"/>
      <p>
        { data[1] }
        <span style={{color: measureColor}}>
          { data[2] }
        </span>
      </p>
    </div>
  )
}

export default Tooltip
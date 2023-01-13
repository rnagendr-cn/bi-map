import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import { hexgrid } from 'd3-hexgrid'
import WORLD_BASE from '../data/world.json'
import colorScaleImg from '../images/viridis-scale.png'
import './HexbinWorldMap.css'
import { newCsvData } from '../data/newData'

const WIDTH = 1075,
      HEIGHT = 560,
      HEX_RADIUS = 5

const Tooltip = ({position, data, measureColor}) => {
  return (
    <div className="maps-tooltip-container"
      style={{
        position: 'fixed',
        top: `${position[1] - 42}px`,
        left: `${position[0] + 10}px`,
      }}
    >
      <p>
        { data[0] }
        <span style={{color: data[2]}}>
          { data[1] }
        </span>
      </p>
    </div>
  )
}

const DotWorldMap = () => {
  const [baseMapPath, setBaseMapPath] = useState(''),
        [hexData, setHexData] = useState([]),
        [miniHexPath, setMiniHexPath] = useState(''),
        [colorDomain, setColorDomain] = useState([0, 10])

  const projection = d3.geoMercator()
                       .scale(140)
                       .translate( [WIDTH / 2 - 20, HEIGHT / 1.5 + 10])

  const geoPath = d3.geoPath()
                    .projection(projection)

  const colourScale = d3.scaleSequential(d3.interpolateViridis)
                        .domain(colorDomain)

  useEffect(() => {
    let temp = newCsvData
      .filter(d => !(d.lat === 0 && d.long === 0))
      .filter(d => d.city !== "(not set)")
      .map(item => {
        const coords = projection([+item.long, +item.lat])
        return {
          ...item,
          x: coords[0],
          y: coords[1],
        }
      })
      console.log(temp)
      setBaseMapPath(
        geoPath(WORLD_BASE)
      )

      const hex = hexgrid()
        .extent([WIDTH, HEIGHT])
        .geography(WORLD_BASE)
        .projection(projection)
        .pathGenerator(geoPath)
        .hexRadius(HEX_RADIUS)
        .edgePrecision(0.3)
        (temp)

      setHexData(hex.grid.layout)
      // console.log(hex.grid.layout)
      setColorDomain(hex.grid.extentPoints)
      setMiniHexPath(hex.hexagon())
  }, [])

    // TOOLTIP
    const [tooltip, setTooltip] = useState(false)
    const [tooltipPosition, setTooltipPosition] = useState([0, 0])  // [x, y]
    const [tooltipData, setTooltipData] = useState([])

    const activateTooltip = (e, value, color) => {
      setTooltipPosition([e.clientX, e.clientY])
      setTooltipData([
        'Number of cities: ',
        Number(value),
        color
      ])
    }

  return(
    <>
    <svg viewBox={[0, 0, WIDTH, HEIGHT]}>
      <rect width={WIDTH} height={HEIGHT} fill="white" />
      {
        baseMapPath && (
          <>
          {/* <g id='world-outline'>
            <path d={ baseMapPath } stroke='black' fill='none' />
          </g> */}
          <g>
          {
            hexData && hexData.map((hex, i) => {
              const colorValue = !hex.datapoints ? '#ccc8c0' : colourScale(hex.datapoints)
              const count = hex.datapoints ? hex.datapoints : 0
              return <circle
                key={i}
                r="4.2"
                transform={`translate(${hex.x}, ${hex.y})`}
                fill={ colorValue }
                onMouseEnter={() => setTooltip(true)}
                onMouseMove={(e) => activateTooltip(e, count, colorValue)}
                onMouseLeave={() => setTooltip(false)}
              />
            })
          }
          </g>
          </>
        )
      }
    </svg>
    <div className='hexbinMap__legendContainer'>
      <p className='hexbinMap__legendTitle'>Legend</p>
      <img className='hexbinMap__legend' src={colorScaleImg} />
      <div className='hexbinMap__legendValues'>
        <p className='hexbinMap__legendMinValue'>
          { colorDomain[0] === 1 ? `${colorDomain[0]} city` : `${colorDomain[0]} cities` }
        </p>
        <p className='hexbinMap__legendMaxValue'>{ colorDomain[1] } cities</p>
      </div>
    </div>
    {
        tooltip ?
          <Tooltip
            position={tooltipPosition}
            data={tooltipData}
            measureColor={"blue"}
          />
        : null
      }
    </>
  )
}

export default DotWorldMap
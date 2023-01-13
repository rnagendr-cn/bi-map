import { useState, useEffect } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import Tooltip from './Tooltip'
import countriesAlbersData from '../data/countries-50m.json'
import { newCsvData } from '../data/newData'

const blueShades = ["#f7fbff", "#f6faff", "#f5fafe", "#f5f9fe", "#f4f9fe", "#f3f8fe", "#f2f8fd", "#f2f7fd", "#f1f7fd", "#f0f6fd", "#eff6fc", "#eef5fc", "#eef5fc", "#edf4fc", "#ecf4fb", "#ebf3fb", "#eaf3fb", "#eaf2fb", "#e9f2fa", "#e8f1fa", "#e7f1fa", "#e7f0fa", "#e6f0f9", "#e5eff9", "#e4eff9", "#e3eef9", "#e3eef8", "#e2edf8", "#e1edf8", "#e0ecf8", "#e0ecf7", "#dfebf7", "#deebf7", "#ddeaf7", "#ddeaf6", "#dce9f6", "#dbe9f6", "#dae8f6", "#d9e8f5", "#d9e7f5", "#d8e7f5", "#d7e6f5", "#d6e6f4", "#d6e5f4", "#d5e5f4", "#d4e4f4", "#d3e4f3", "#d2e3f3", "#d2e3f3", "#d1e2f3", "#d0e2f2", "#cfe1f2", "#cee1f2", "#cde0f1", "#cce0f1", "#ccdff1", "#cbdff1", "#cadef0", "#c9def0", "#c8ddf0", "#c7ddef", "#c6dcef", "#c5dcef", "#c4dbee", "#c3dbee", "#c2daee", "#c1daed", "#c0d9ed", "#bfd9ec", "#bed8ec", "#bdd8ec", "#bcd7eb", "#bbd7eb", "#b9d6eb", "#b8d5ea", "#b7d5ea", "#b6d4e9", "#b5d4e9", "#b4d3e9", "#b2d3e8", "#b1d2e8", "#b0d1e7", "#afd1e7", "#add0e7", "#acd0e6", "#abcfe6", "#a9cfe5", "#a8cee5", "#a7cde5", "#a5cde4", "#a4cce4", "#a3cbe3", "#a1cbe3", "#a0cae3", "#9ec9e2", "#9dc9e2", "#9cc8e1", "#9ac7e1", "#99c6e1", "#97c6e0", "#96c5e0", "#94c4df", "#93c3df", "#91c3df", "#90c2de", "#8ec1de", "#8dc0de", "#8bc0dd", "#8abfdd", "#88bedc", "#87bddc", "#85bcdc", "#84bbdb", "#82bbdb", "#81badb", "#7fb9da", "#7eb8da", "#7cb7d9", "#7bb6d9", "#79b5d9", "#78b5d8", "#76b4d8", "#75b3d7", "#73b2d7", "#72b1d7", "#70b0d6", "#6fafd6", "#6daed5", "#6caed5", "#6badd5", "#69acd4", "#68abd4", "#66aad3", "#65a9d3", "#63a8d2", "#62a7d2", "#61a7d1", "#5fa6d1", "#5ea5d0", "#5da4d0", "#5ba3d0", "#5aa2cf", "#59a1cf", "#57a0ce", "#569fce", "#559ecd", "#549ecd", "#529dcc", "#519ccc", "#509bcb", "#4f9acb", "#4d99ca", "#4c98ca", "#4b97c9", "#4a96c9", "#4895c8", "#4794c8", "#4693c7", "#4592c7", "#4492c6", "#4391c6", "#4190c5", "#408fc4", "#3f8ec4", "#3e8dc3", "#3d8cc3", "#3c8bc2", "#3b8ac2", "#3a89c1", "#3988c1", "#3787c0", "#3686c0", "#3585bf", "#3484bf", "#3383be", "#3282bd", "#3181bd", "#3080bc", "#2f7fbc", "#2e7ebb", "#2d7dbb", "#2c7cba", "#2b7bb9", "#2a7ab9", "#2979b8", "#2878b8", "#2777b7", "#2676b6", "#2574b6", "#2473b5", "#2372b4", "#2371b4", "#2270b3", "#216fb3", "#206eb2", "#1f6db1", "#1e6cb0", "#1d6bb0", "#1c6aaf", "#1c69ae", "#1b68ae", "#1a67ad", "#1966ac", "#1865ab", "#1864aa", "#1763aa", "#1662a9", "#1561a8", "#1560a7", "#145fa6", "#135ea5", "#135da4", "#125ca4", "#115ba3", "#115aa2", "#1059a1", "#1058a0", "#0f579f", "#0e569e", "#0e559d", "#0e549c", "#0d539a", "#0d5299", "#0c5198", "#0c5097", "#0b4f96", "#0b4e95", "#0b4d93", "#0b4c92", "#0a4b91", "#0a4a90", "#0a498e", "#0a488d", "#09478c", "#09468a", "#094589", "#094487", "#094386", "#094285", "#094183", "#084082", "#083e80", "#083d7f", "#083c7d", "#083b7c", "#083a7a", "#083979", "#083877", "#083776", "#083674", "#083573", "#083471", "#083370", "#08326e", "#08316d", "#08306b"]


const HEIGHT = 975,
      WIDTH = 550,
      // For country names in CSV dataset that differ from their name in albers dataset
      rename = new Map([
        ["Antigua & Barbuda", "Antigua and Barb."],
        ["Bosnia & Herzegovina", "Bosnia and Herz."],
        ["Central African Republic", "Central African Rep."],
        ["Cook Islands", "Cook Is."],
        ["Dominican Republic", "Dominican Rep."],
        ["Equatorial Guinea", "Eq. Guinea"],
        ["Marshall Islands", "Marshall Is."],
        ["Solomon Islands", "Solomon Is."],
        ["South Sudan", "S. Sudan"],
        ["United States", "United States of America"]
      ])

const ChoroplethWorldNew = () => {
  const [geoData, setGeoData] = useState([])
  const [data, setData] = useState(new Map())
  const [pvExtent, setPvExtent] = useState([0,1])
  const [uuExtent, setUuExtent] = useState([0,1])

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  // useEffect(() => {
  //   console.log(pvExtent)
  // }, [pvExtent])

  // useEffect(() => {
  //   console.log(uuExtent)
  // }, [uuExtent])

  // const color = d3.scaleQuantize()
  //   .domain(pvExtent)
  //   .range(d3.schemeBlues[9].slice(2,8))

  // page views extend
  const blues = d3.schemeBlues[9].slice(0, 9)
  const thresholds = [0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]
  const thresholdLabels = ["NA", "0+", "100+", "1K+", "10K+", "100K+", "1M+", "10M+", "100M+"]
  let color = d3.scaleThreshold()
    .domain(thresholds)
    .range(blues)

  // unique users extend
  const blues2 = d3.schemeBlues[9].slice(0, 9)
  const thresholds2 = [0, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000]
  const thresholdLabels2 = ["NA", "Less than 100", "Less than 1K", "Less than 10K", "Less than 100K", "Less than 1M", "Less than 10M", "Less than 100M", "100M and more"]
  let color2 = d3.scaleThreshold()
    .domain(thresholds2)
    .range(blues2)

  // const color = d3.scaleSequential()
  //   .domain(pvExtent)
  //   .interpolator(d3.interpolateBlues)
  //   .unknown("#ccc")

  // const color = d3.scaleSequential()
  //   .domain(uuExtent)
  //   .interpolator(d3.interpolateBlues)
  //   .unknown("#ccc")

  var projection = d3.geoMercator()
    .center([10, 40])

  useEffect(() => {
    setGeoData(
      feature(countriesAlbersData, countriesAlbersData.objects.countries).features
    )

    const uniqueCountries = [...new Set(newCsvData.map(d => d.country))]
    console.log(uniqueCountries)
    const albersCountries = countriesAlbersData.objects.countries.geometries.map(d => d.properties.name)
    console.log(albersCountries)

    let data = newCsvData
      .filter(d => albersCountries.includes(d.country) || rename.get(d.country))
      .map(d => {
        if(!albersCountries.includes(d.country)) {
          return {
            ...d,
            country: rename.get(d.country),
          }
        }
        else return d
      })
    // console.log(data)
    
    const temp = new Map()
    data.forEach(({country, pageviews, uniqueUsers}) => {
      if(temp.has(country)) {
        const {pv, uu} = temp.get(country)
        const newValue = {
          pv: pv + pageviews,
          uu: uu + uniqueUsers,
        }
        temp.set(country, newValue)
      } else {
        temp.set(country, {
          pv: pageviews,
          uu: uniqueUsers,
        })
      }
    })
    // console.log(temp)
    setData(temp)
    const tempValues = Array.from(temp.values())
    const pageViewsExtent = d3.extent(tempValues.map(d => d.pv))
    const uniqueUsersExtent = d3.extent(tempValues.map(d => d.uu))
    setPvExtent(pageViewsExtent)
    setUuExtent(uniqueUsersExtent)

    // console.log(tempValues.map(d => d.pv).sort((a,b) => a-b))
  }, [])

  // TOOLTIP
  const [tooltip, setTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState([0, 0])  // [x, y]
  const [tooltipData, setTooltipData] = useState([])

  const activateTooltip = (e, title, views) => {
    setTooltipPosition([e.clientX, e.clientY])
    setTooltipData([
      title,
      'Value: ',
      views ? views.toLocaleString() : "No Data Available"
    ])
  }

  return(
    <>
    <h1>Total Pageviews</h1>
    <svg viewBox={[0, 0, HEIGHT, WIDTH]}>
      <g>
      {
        geoData && geoData.map((item, i) => {
          const v = data.get(item.properties.name)?.pv
          return (
            <path
              key={i}
              fill={ v ? color(v) : color(0) }
              stroke='white'
              d={ d3.geoPath(projection)(item) }
              onMouseEnter={() => setTooltip(true)}
              onMouseMove={(e) => activateTooltip(e, item.properties.name, v)}
              onMouseLeave={() => setTooltip(false)}
            />
          )
        })
      }
      </g>
    </svg>
    {
      tooltip ?
        <Tooltip
          position={tooltipPosition}
          data={tooltipData}
          measureColor={"blue"}
        />
      : null
    }
    <div style={{ display: "flex", flexDirection: "column-reverse", marginBottom: "3rem" }}>
    {
          blues.map((d, i) => (
            <div style={{display: "flex"}}>
        <div style={{
          width: "30px",
          height: "30px",
          background: d
              }} />
              <p style={{ margin: 0, padding: "2px 0 0 0.5rem" }}>{thresholdLabels[i]}</p>
        </div>
      ))
    }
    </div>
    {/* */}
    <h1>Unique Users</h1>
    <svg viewBox={[0, 0, HEIGHT, WIDTH]}>
      <g>
      {
        geoData && geoData.map((item, i) => {
          const v = data.get(item.properties.name)?.uu
          return (
            <path
              key={i}
              fill={ v ? color2(v) : color2(0) }
              stroke='white'
              d={ d3.geoPath(projection)(item) }
              onMouseEnter={() => setTooltip(true)}
              onMouseMove={(e) => activateTooltip(e, item.properties.name, v)}
              onMouseLeave={() => setTooltip(false)}
            />
          )
        })
      }
      </g>
    </svg>
    {
      tooltip ?
        <Tooltip
          position={tooltipPosition}
          data={tooltipData}
          measureColor={"blue"}
        />
      : null
    }
    <div style={{ display: "flex", flexDirection: "column-reverse", marginBottom: "3rem" }}>
    {
          blues2.map((d, i) => (
            <div style={{display: "flex"}}>
        <div style={{
          width: "30px",
          height: "30px",
          background: d
              }} />
              <p style={{ margin: 0, padding: "2px 0 0 0.5rem" }}>{thresholdLabels2[i]}</p>
        </div>
      ))
    }
    </div>
    </>
  )
}

export default ChoroplethWorldNew
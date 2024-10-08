import React from 'react'
import { Circle, Popup } from 'react-leaflet'
import numeral from 'numeral'

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 800,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 1200,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 2000,
    },
};

export const sortData = (data: any[]) => { // Type annotation retained
    const sortedData = [...data]

    sortedData.sort((a, b) => {
        return a.cases > b.cases ? -1 : 1; // Simplified return statement
    })

    return sortedData
}

export const showDataOnMap = (data: any[], casesType: keyof typeof casesTypeColors = 'cases') : any => { // Type annotations retained
    return data.map(country => (
       <Circle
       key={country.countryInfo._id} // Key prop for React
       center={[country.countryInfo.lat, country.countryInfo.long]}
       fillOpacity={0.4}
       pathOptions={{
           fillColor: casesTypeColors[casesType].rgb,
           color: casesTypeColors[casesType].rgb
       }}
       radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
       >
          <Popup>
                <div className='info_container'>
                <div className='info_flag' style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
                <div className='info_name'>{country.country}</div>
                <div className='info_cases'>Cases: {numeral(country.cases).format('0,0')}</div>
                <div className='info_recovered'>Recovered: {numeral(country.recovered).format('0,0')}</div>
                <div className='info_deaths'>Deaths: {numeral(country.deaths).format('0,0')}</div>
                </div>
          </Popup>
       </Circle>
    ))
}

export const prettier = (stat: number | null) => ( // Type annotation retained
    stat ? `+${numeral(stat).format('0.0a')}` : `+0` 
)
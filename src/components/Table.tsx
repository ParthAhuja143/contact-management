import React from 'react'
import numeral from 'numeral'

function Table({ countries }: { countries: { country: string; cases: number }[] }) { // Added type annotation
    return (
        <div className='table'>
            {
                countries.map(country => (
                    <tr className='table_row' key={country.country}> {/* Removed dark mode code and added key prop */}
                        <td className='table_name'>{country.country}</td>
                        <td className='table_data'><strong>{numeral(country.cases).format('0,0')}</strong></td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
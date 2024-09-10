import React, { useEffect, useState } from "react"; // Added React import
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import "leaflet/dist/leaflet.css";
import InfoBox from "components/InfoBox";
import { prettier, sortData } from "utils";
import { LineGraph, Map } from "components";
import Table from "components/Table";
interface Country {
  country: string;
  countryInfo: {
    iso2: string;
    lat: number;
    long: number;
    flag: string;
    todayDeaths: number;
    todayCases: number;
    cases: number;
  };
  cases: number;
  recovered: number;
  deaths: number;
  todayCases: number;
  todayRecovered: number;
  todayDeaths: number;
  value: any;
  name: string;
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("worldwide");
  const [countryInfo, setCountryInfo] = useState<Country | null>(null);
  const [tableData, setTableData] = useState<Country[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    34.80746, -40.4796,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(2);
  const [mapCountries, setMapCountries] = useState<Country[]>([]);
  const [casesType, setCasesType] = useState<"cases" | "recovered" | "deaths">(
    "cases"
  );
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countriesData = data.map((country: Country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countriesData);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const countryCode = event.target.value as string;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSelectedCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(5);
        } else {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(2);
        }
      });
  };

  return (
    <div className={`app ${darkMode && "appDark"}`}>
      <div className="app_left">
        <div className={`app_header ${darkMode && "app_headerDark"}`}>
          <h1>COVID-19 TRACKER</h1>
          <div className="app_darkMode">
            <label className={`label ${darkMode && "label_dark"}`}>
              <div className={`toggle ${darkMode && "toggle_dark"}`}>
                <input
                  onChange={() => setDarkMode(!darkMode)}
                  className="toggle-state"
                  type="checkbox"
                  name="check"
                  value="check"
                />
                <div
                  className={`indicator ${darkMode && "indicator_dark"}`}></div>
              </div>
            </label>
          </div>

          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={selectedCountry}
              onChange={(event) => onCountryChange(event as React.ChangeEvent<{ value: unknown }>)}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem> // Added key prop
              ))}
            </Select>
          </FormControl>
        </div>

        {countryInfo &&  <div className="app_stats">
        <InfoBox
            darkMode={darkMode}
            isRed
            active={casesType === "cases"}
            onClick={() => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={Number(prettier(countryInfo.todayCases))}
            total={countryInfo.cases}
          />
          <InfoBox
            darkMode={darkMode}
            isRed={false}
            active={casesType === "recovered"}
            onClick={() => setCasesType("recovered")}
            title="Recovered"
            cases={Number(prettier(countryInfo.todayRecovered))}
            total={countryInfo.recovered}
          />
          <InfoBox
            darkMode={darkMode}
            isRed
            active={casesType === "deaths"}
            onClick={() => setCasesType("deaths")}
            title="Deaths"
            cases={Number(prettier(countryInfo.todayDeaths))}
            total={countryInfo.deaths}
          />
        </div>}

        <Map
          darkMode={darkMode}
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className={`app_right ${darkMode && "app_right_dark"}`} sx={{
          margin: '20px'
        }}>
        <CardContent>
          <h3 className={`${darkMode && "h3_dark"}`}>Live Cases by Country</h3>
          <Table countries={tableData} /> {/* Removed darkMode prop */}
          <h3 className={`app_graphTitle ${darkMode && "app_graphTitle_dark"}`}>
            Worldwide New {casesType}
          </h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

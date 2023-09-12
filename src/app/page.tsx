import axios from 'axios';
import { FSAMapping, SheetData } from './interfaces';
import { DataTable } from './datatable';
import { columns } from './columns';

async function getData() {
  try {
    const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.SPREAD_SHEET_ID}/values/${process.env.SHEET_NAME}?key=${process.env.API_KEY}`)
    return response.data
  } catch (err) {
    console.error(err);
  }
}

async function reorderPostalCodeFirst(data: SheetData) {
  const desiredOrder = ["Postal Code FSA", "Location City", "Completed Jobs", "Completed Revenue"]
  const headers = data.values[0]
  const columnIndices = desiredOrder.map((header: string) => headers.indexOf(header))

  // Check if all desired headers exist in the sheet data, otherwise return the original data
  if (columnIndices.includes(-1)) {
    return data
  }

  // Identify columns not in the desiredOrder and get their indices
  const remainingColumnsIndices = headers
    .map((header: string, index: number) => (columnIndices.includes(index) ? null : index))
    .filter((index: string) => index !== null);
  
  const reorderedData: SheetData = { values: [] };

  for (const row of data.values) {
    const newRow = [
      ...columnIndices.map((index: number) => row[index]),
      ...remainingColumnsIndices.map((index: number) => row[index])
    ];

    // Remove any FSA that are empty or more than 3 characters
    if (newRow[0].length === 3) {
      reorderedData.values.push(newRow)
    }
  }
  return reorderedData
}

function currencyToNumber(currency: string) {
  return parseFloat(currency.replace(/[\$,]/g, '')); // Replaces "$" and "," with an empty string "". eg "$1,000,000" => "1000000"
}

function sortByBestAverageRevenueByFSA(data: SheetData) {
  // Create a mapping for each "Postal Code FSA" to its cumalative revenue and job counts
  const fsaMapping: Record<string, FSAMapping> = {};

  for (let index = 1; index < data.values.length; index++) {
    const fsa = data.values[index][0]
    const city = data.values[index][1]
    const jobs = parseInt(data.values[index][2].replace(/,/g, ''))
    const revenue =currencyToNumber(data.values[index][3])
    
    if (!fsaMapping[fsa] || fsaMapping[fsa] === undefined) {
      fsaMapping[fsa] = {fsa: fsa, city: city, cumulativeRevenue: 0, cumulativeJobs: 0, averageRevenuePerJob: 0}
    }

    fsaMapping[fsa].cumulativeRevenue += revenue
    fsaMapping[fsa].cumulativeJobs += jobs
    fsaMapping[fsa].averageRevenuePerJob = fsaMapping[fsa].cumulativeRevenue / fsaMapping[fsa].cumulativeJobs
  }

  // Convert Record entries to array and sort by average revenue
  const sortedFSAs: FSAMapping[] = Object.values(fsaMapping).sort((a, b) => b.averageRevenuePerJob - a.averageRevenuePerJob);
  
  return sortedFSAs
}

export default async function Home() {
  const data = await getData()
  const reorderedData = await reorderPostalCodeFirst(data)
  const sortedData = sortByBestAverageRevenueByFSA(reorderedData)

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={sortedData} />
    </div>
  )
}

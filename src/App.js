import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

function App() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [pinCode, setPinCode] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [searched, setSearched] = useState("");

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,|;/);

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(',');
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c
    }));

    setData(list);
    setColumns(columns);
  };

  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = evt => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  //Filter PinCode
const filterItemsPinCode = (text) => {
  // const dupData = data;
  const pin = new RegExp(`^${text.target.value}`, "i");
  const date = new RegExp(`^${orderDate}`, "i");
  const value = data.filter(list => pin.test(list.deliveryPincode) && date.test(list.orderDate))
  setSearched(value);
  setPinCode(text.target.value)
}

//Filter OrderDate
const filterItemsOrderDate = (text) => {
  const pin = new RegExp(`^${pinCode}`, "i");
  const date = new RegExp(`^${text.target.value}`, "i");
  const value = data.filter(list => pin.test(list.deliveryPincode) && date.test(list.orderDate))
  setSearched(value);
  setOrderDate(text.target.value)
}

  return (
    <div style={{ margin: '44px', textAlign: 'center'}}>
      <h2 style={{ color: 'red', backgroundColor: 'black' }}>AntStack</h2>
      <h3>
        Read CSV file in React
      </h3>
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
      <br />
      <label className="inputfield"> Pincode:
        <input placeholder="Enter PinCode" value={pinCode} onChange={text => { filterItemsPinCode(text) }} />
      </label>
      <label className="inputfield"> Date:
        <input placeholder="Enter date (dd/mm/yyyy)" value={orderDate} onChange={text => { filterItemsOrderDate(text) }} />
      </label>
      <DataTable pagination highlightOnHover columns={columns} data={searched ? searched : data}/>
    </div>
  );
}

export default App;

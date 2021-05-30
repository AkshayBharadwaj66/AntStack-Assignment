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
const filterPinCode = (text) => {
  const pin = new RegExp(`^${text.target.value}`, "i");
  const date = new RegExp(`^${orderDate}`, "i");
  const value = data.filter(list => pin.test(list.deliveryPincode) && date.test(list.orderDate))
  setSearched(value);
  setPinCode(text.target.value)
}

//Filter OrderDate
const filterOrderDate = (text) => {
  const pin = new RegExp(`^${pinCode}`, "i");
  const date = new RegExp(`^${text.target.value}`, "i");
  const value = data.filter(list => pin.test(list.deliveryPincode) && date.test(list.orderDate))
  setSearched(value);
  setOrderDate(text.target.value)
}

  return (
    <div style={{ margin: '44px'}}>
      <h2 style={{ color: 'red', backgroundColor: 'black', textAlign: 'center' }}>AntStack</h2>
      <h3 style={{textAlign: 'center'}}>
        Read CSV file in React
      </h3>
      <h3 style={{textAlign: 'center'}}>
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
      </h3>
      <br /> <br />
      <label className="inputfield"> Pincode: 
        <input placeholder="Enter PinCode" value={pinCode} onChange={text => { filterPinCode(text) }} />
      </label>
      <label className="inputfield" style={{marginLeft: '70%'}}> Date: 
        <input placeholder="Enter date (dd/mm/yyyy)" value={orderDate} onChange={text => { filterOrderDate(text) }} />
      </label>
      <DataTable style={{textAlign: 'center'}} pagination highlightOnHover columns={columns} data={searched ? searched : data}/>
    </div>
  );
}

export default App;
 
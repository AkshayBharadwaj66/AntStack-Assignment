import React from 'react';
import { parse } from 'papaparse';

const CsvReader = ({ getResult }) => {
    const [highlighted, setHighlighted] = React.useState(false);    
    return (
        <div>
            <h1>Order Dashboard </h1>
            <div className="dragndrop"
                onDragEnter={() => {
                    setHighlighted(true);
                }}
                onDragLeave={() => {
                    setHighlighted(false);
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                }}
                onDrop={(e) => {
                    e.preventDefault();
                    setHighlighted(false);

                    Array.from(e.dataTransfer.files)
                        .filter((file) => file.type === "text/csv")
                        .forEach(async (file) => {
                        const text = await file.text();
                        const result = parse(text, { header: true });                        
                        getResult(result)
                    });
                }}
            >
                DROP YOUR CSV FILE HERE
            </div>
        </div>
    );
};

export default CsvReader;
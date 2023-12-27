import { useEffect, useState } from "react";

export function Test() {
  const [list, setList] = useState([]);
  useEffect(
    function () {
      async function fetchFlag() {
        try {
          const res = await fetch(
            "https://countriesnow.space/api/v0.1/countries/flag/images"
          );
          const data = await res.json();
          console.log(data.data);
          setList(data.data);
        } catch (err) {
          console.error("Error fetching data");
        }
      }
      fetchFlag();
    },
    [setList]
  );
  //
  return (
    <div>
      {list.map((item) => (
        <div key={item.iso2}>
          <span > {item.name}</span>
          <img
            src={`https://flagcdn.com/${item.iso2.toLowerCase()}.svg`}
            width="100"
            height="100"
          />
        </div>
      ))}
    </div>
  );
}

export default Test;
